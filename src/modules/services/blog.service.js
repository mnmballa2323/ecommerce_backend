const paginationHelpers = require("../helpers/paginationHelpers");
const Blogs = require("../model/Blog");
const Comment = require("../model/Comment");


module.exports.getBlogService = async (filters, paginationOptions) => {
    const { searchTerm, ...filtersData } = filters;

    const productsSearchAbleFields = ["name", "author", "category"];
    const andConditions = [];

    // Add a default condition if andConditions is empty
    if (andConditions.length === 0) {
        andConditions.push({});
    }

    if (searchTerm) {
        andConditions.push({
            $or: productsSearchAbleFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            })),
        });
    }

    // if (Object.keys(filtersData).length) {
    //     andConditions.push({
    //         $and: Object.entries(filtersData).map(([field, value]) => ({
    //             [field]: value,
    //         })),
    //     });
    // }

    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions)

    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const blogData = await Blogs.find({ $and: andConditions }).sort(sortConditions).skip(skip).limit(limit).populate('comments')
    // console.log(blogData)
    const total = await Blogs.estimatedDocumentCount()
    return {
        meta: {
            page,
            limit,
            total
        },
        data: blogData
    };
}


module.exports.addBlogServices = async (data) => {

    // console.log(data, 'blog dataaa')
    const result = await Blogs.create(data)
    // console.log(result, "dataasss")
    return result;
}


module.exports.getBlogServiceById = async (id) => {
    const result = await Blogs.findById(id)
    return result;
}
// module.exports.getBlogServiceById = async (id) => {
//     const result = await Blogs.findOne({ _id: id })
//     // console.log(result, 'resultt blog details')
//     return result;
// }

module.exports.getBlogServiceByEmail = async (email) => {
    const result = await Blogs.find({ authorEmail: email })
    // console.log(result, 'resultt blog details')
    return result;
}

module.exports.updateBlogService = async (storeId, data) => {
    console.log(data);
    const result = await Blogs.updateOne({ _id: storeId }, { $set: data }, { runValidators: true })

    return result;
}

exports.deleteBlogService = async (id) => {
    const result = await Blogs.deleteOne({ _id: id })
    return result
}

module.exports.getBlogSuggestionService = async (name) => {
    const result = await Blogs.find({ category: name }).limit(3)
    return result;
}


// module.exports.addCommentServices = async (data) => {

//     // Check if the user already has a store
//     // const existingStore = await Blogs.findOne({ email: email });

//     // if (existingStore) {
//     //     return { error: 'One user can add one comment' };
//     // }

//     const result = await Comment.create(data)
//     // console.log(result, "resulttttt comment")
//     return result;
// }

// module.exports.getCommnetService = async (blogId) => {
//     const comments = Blogs.findById(blogId)
//         .populate({
//             path: 'comments',
//             populate: {
//                 path: 'replies',
//                 model: 'Comment',
//             },
//         })

//     return comments;
// }


const getCommentTree = async (comment) => {
    const commentData = {
        _id: comment._id,
        user: comment.user,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        replies: [],
    };

    if (comment.replies && comment.replies.length > 0) {
        commentData.replies = await Promise.all(comment.replies.map(async replyId => {
            const reply = await Comment.findById(replyId)
                .populate({
                    path: 'user replies.user replies.replies.user',
                    model: 'User',
                });
            return getCommentTree(reply);
        }));
    }

    return commentData;
};

module.exports.getCommentService = async (blogId) => {
    const blog = await Blogs.findById(blogId)
        .populate({
            path: 'comments',
            populate: {
                path: 'user replies.user replies.replies.user',
                model: 'User',
            },
        });

    if (!blog) {
        throw new Error("Blog not found");
    }

    const comments = await Promise.all(blog.comments.map(async comment => getCommentTree(comment)));

    return {
        _id: blog._id,
        comments,
    };
};


module.exports.addCommentServices = async (blogId, content, userId) => {
    const newComment = new Comment({
        user: userId,
        content,
    });

    await newComment.save();

    const blog = await Blogs.findByIdAndUpdate(
        blogId,
        { $push: { comments: newComment._id } },
        { new: true }
    );
    return blog;
}

module.exports.addReplyServices = async (commentId, userId, content) => {
    const newReply = new Comment({
        user: userId,
        content,
    });

    await newReply.save();

    const reply = await Comment.findByIdAndUpdate(
        commentId,
        { $push: { replies: newReply._id } },
        { new: true }
    );

    return reply;
}

module.exports.deleteCommentServices = async (commentId) => {
    const result = await Comment.findByIdAndDelete(commentId);
    console.log(result);
    return result
}

module.exports.editCommentServices = async (commentId, content) => {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    return updatedComment;
}

