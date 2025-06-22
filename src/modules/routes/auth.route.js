const express = require("express")
const { authController } = require("../controllers/auth.controller")
const router = express.Router()
// const authContoller = require("../controllers/auth.controller")
const Auth = require('../middleware/auth')
const { registerMail } = require("../controllers/mailer")

router.route('/register').post(authController.register)// Register user
router.route('/registerSeller').post(authController.sellerRegistration)// Register seller
router.route('/register/confirmation/:token').get(authController.confirmEmail)// verify mail

router.route('/registerMail').post(registerMail) // send the email
router.route('/authenticate').post((req, res) => res.end()) // authenticate user
router.route('/login').post(authController.login) // login in app



router.route('/allUser').get(authController.getAllUsers) // user with email 
router.route('/user/:email').get(authController.getUser) // user with email 
router.route('/generateOTP').get(Auth.localVariables, authController.generateOTP) // generate random OTP 
router.route('/verifyOTP').get(authController.verifyOTP) // verify generate OTP
router.route('/createResetSession').get(authController.crateResetSession) // reset all the variable


router.route('/updateUser/:userEmail').put(authController.updateUser) // is to use update user profile
router.route('/resetPassworad').put(authController.resetPassword) // use to reset password


module.exports = router;