const express = require("express")
const router = express.Router()
const wishlistRoute = require("../controllers/addToWishlist.controller")


router.route('/delete/:productId').delete(wishlistRoute.removeWishlist)
router.route('/users/:userId').get(wishlistRoute.wishlistedById)
router.route('/').post(wishlistRoute.addToWishlist)


module.exports = router;