const express = require("express")
const router = express.Router()
const paymentRoute = require("../controllers/payment.controller")




router.route('/delete/:id').delete(paymentRoute.deletePayment)
router.route('/createPaymentIntent').post(paymentRoute.createPayment)
router.route('/updatePayment').patch(paymentRoute.updatePayment)
router.route('/seller/paymentItems').get(paymentRoute.getAllPayment)
router.route('/buyer/paymentItem').get(paymentRoute.getPayment)
router.route('/singlePayment/:id').get(paymentRoute.getSinglePayment)
router.route('/admin/orders').get(paymentRoute.getAdminAllPayment)


module.exports = router;



