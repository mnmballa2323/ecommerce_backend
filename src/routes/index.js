const express = require("express");
const router = express.Router();


const productRoute = require('../../src/modules/routes/product.route')
// const supplierRoute = require('../../src/modules/routes/supplier.route')
const storeRoute = require('../../src/modules/routes/store.route')
const authRoute = require('../../src/modules/routes/auth.route')
const addToCartRoute = require('../modules/routes/addToCart.route')
const adminRoute = require('../../src/modules/routes/admin.route')
const blogRoute = require('../../src/modules/routes/blog.route')
const paymentRoute = require('../../src/modules/routes/payment.route')
const addTowishlistRoute = require('../../src/modules/routes/addToWishlist.route')
const chatRoute = require('../modules/routes/chat.route')
const messageRoute = require('../modules/routes/message.route')


const moduleRoutes = [
    {
        path: '/products',
        route: productRoute,
    },
    {
        path: '/store',
        route: storeRoute,
    },
    {
        path: '/',
        route: authRoute,
    },
    {
        path: '/manageSeller',
        route: adminRoute,
    },
    {
        path: '/blogs',
        route: blogRoute,
    },
    // {
    //     path: '/supplier',
    //     route: supplierRoute,
    // },
    {
        path: '/addToCart',
        route: addToCartRoute,
    },
    {
        path: '/wishlist',
        route: addTowishlistRoute,
    },

    {
        path: '/payment',
        route: paymentRoute,
    },
    {
        path: '/chat',
        route: chatRoute,
    },
    {
        path: '/message',
        route: messageRoute,
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

module.exports = router;