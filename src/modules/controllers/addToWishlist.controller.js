const UserModel = require("../model/auth");
const { addToWishlistService, getWishlistServiceById, removeWishlistService } = require("../services/addToWishlist.service");


module.exports.wishlistedById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await getWishlistServiceById(userId);


        res.status(200).json({
            status: "Success",
            message: "Wishlist get Successfully",
            data: result.wishlist
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Failed to get wishlist",
            error: error.message
        });
        console.log(error, 'error');
    }
}


exports.addToWishlist = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;
        const result = await addToWishlistService(userId, productId);


        res.status(200).json({
            status: "Success",
            message: "Wishlist updated Successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Failed to add product to wishlist",
            error: error.message
        });
        console.log(error, 'error');
    }
};


exports.removeWishlist = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const { userId } = req.body;
        const result = await removeWishlistService(userId, productId);


        res.status(200).json({
            status: "Success",
            message: "Product removed from wishlist",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Failed to remove product from wishlist",
            error: error.message
        });
        console.error(error);
    }
};



