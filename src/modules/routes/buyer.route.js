const express = require("express")
const { authController } = require("../controllers/auth.controller");
const { buyerController } = require("../controllers/buyer.controller");
const router = express.Router()


router.route('/allBuyer').get(authController.verifyUser, buyerController.getAllBuyer )

module.exports = router;


