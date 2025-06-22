const express = require("express")
const router = express.Router()
const userRoute = require("../controllers/addToCart.controller")


router.route('/delete/:id').delete(userRoute.deleteAddToCart)
router.route('/update/:id').put(userRoute.updateAddToCart)
router.route('/updateQuantity/:id').put(userRoute.increaseDecressAddToCart)


router.route('/')
    .post(userRoute.addToCart)
    .get(userRoute.getAddToCart)


module.exports = router;
