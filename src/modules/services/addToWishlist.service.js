const UserModel = require("../model/auth");


exports.getWishlistServiceById = async (userId) => {
    const wishlist = await UserModel.findById(userId).populate('wishlist');

    return wishlist;
}


exports.addToWishlistService = async (userId, productId) => {
    try {
        const user = await UserModel.findById(userId);


        const alreadyAdded = user.wishlist.includes(productId);
        if (alreadyAdded) {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $pull: { wishlist: productId } },
                { new: true }
            );
            return updatedUser;
        } else {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $push: { wishlist: productId } },
                { new: true }
            );
            return updatedUser;
        }
    } catch (error) {
        throw new Error(`Failed to update wishlist: ${error.message}`);
    }
};


exports.removeWishlistService = async (userId, productId) => {
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }


        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);


        await user.save();


        return user;
    } catch (error) {
        throw new Error(`Failed to update wishlist: ${error.message}`);
    }
};

