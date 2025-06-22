const mongoose = require("mongoose");


const paymentSchema = mongoose.Schema({
    payment: { type: String },
    transactionId: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    imageUrls: [{ type: String }],
    category: { type: String, required: true },
    discount: { type: Number},
    sellerEmail: { type: String},
    formData: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        country: { type: String, required: true },
        town: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        shippingMethod: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }
});


const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment;

