const pick = require("../middleware/pick");
const {
  addBlogServices,
  getBlogService,
  getBlogServiceById,
  updateBlogService,
  deleteBlogService,
  addCommentServices,
  deleteCommentServices,
  getBlogSuggestionService,
  getBlogServiceByEmail,
  addReplyServices,
  editCommentServices,
  getCommentService,
} = require("../services/blog.service");

module.exports.addBlog = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await addBlogServices(data);

    res.status(200).json({
      status: "success",
      message: "Add Blog Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Blog doesn't add successfully",
      error: error.message,
    });
  }
};

module.exports.getBlog = async (req, res) => {
  try {
    const paginationOptions = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const filters = pick(req.query, ["searchTerm", "name", "author", "category"]);

    const result = await getBlogService(filters, paginationOptions);
    // const result = await getBlogService(req.body)

    res.status(200).json({
      status: "success",
      message: "Get Blogs Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't get blogs successfully",
      error: error.message,
    });
  }
};

module.exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getBlogServiceById(id);
    res.status(200).json({
      status: "Success",
      message: "Get blog by id successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't not get blog by id",
      error: error.message,
    });
  }
};


module.exports.getBlogByEmail = async (req, res) => {
  const { email } = req.params;
  console.log(email, 'blog email');
  try {
    const result = await getBlogServiceByEmail(email);
    res.status(200).json({
      status: "Success",
      message: "Get blog by email successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't not get blog by email",
      error: error.message,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateBlogService(id, req.body);
    res.status(200).json({
      status: "Success",
      message: "Blog Update Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Blog couldn't Update Successfully",
      error: error.message,
    });
    console.log(error, "error");
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteBlogService(id);

    if (!result.deletedCount) {
      return res.status(400).json({
        status: "fail",
        error: "Could't delete the blog",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Blog Delete Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Blog couldn't Delete Successfully",
      error: error.message,
    });
    console.log(error, "error");
  }
};

module.exports.getBlogSuggestion = async (req, res) => {
  try {
    const { suggestion } = req.params;
    // console.log(suggestion, 'suggestion suggestion')

    const result = await getBlogSuggestionService(suggestion);

    res.status(200).json({
      status: "success",
      message: "Get Blogs suggestion Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't get blogs suggestion",
      error: error.message,
    });
  }
};

module.exports.getComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const result = await getCommentService(blogId);

    res.status(200).json({
      status: "success",
      message: "Get Comment Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't get Comment successfully",
      error: error.message,
    });
  }
};


exports.addComment = async (req, res) => {
  try {
    const { blogId, userId, content } = req.body;
    const result = await addCommentServices(blogId,content,userId);

    res.status(200).json({
      status: "success",
      message: "Comment Add Successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    const { commentId, userId, content } = req.body;
    const reply = await addReplyServices(commentId, userId, content);

    res.status(200).json({
      status: "success",
      message: "Reply Add Successfully",
      data: reply,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    console.log(commentId)
    const result = await deleteCommentServices(commentId);

    res.status(200).json({
      status: "Success",
      message: "Comment Delete Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Blog couldn't Delete Successfully",
      error: error.message,
    });
    console.log(error, "error");
  }
};

exports.editComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const result = await editCommentServices(commentId, content);

    // if (!result.deletedCount) {
    //   return res.status(400).json({
    //     status: "fail",
    //     error: "Could't delete the Comment",
    //   });
    // }

    res.status(200).json({
      status: "Success",
      message: "Comment Edit Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Blog couldn't Edit Successfully",
      error: error.message,
    });
    console.log(error, "error");
  }
};
