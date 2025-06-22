const mongoose = require("mongoose");

// Schema Design
const addToCartSchema = mongoose.Schema({
    cart: {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrls: [{ type: String, required: true }],
        discount: { type: Number, default: 20 },
        quantity: { type: Number, required: true },
        category: { type: String, required: true },
        sellerEmail: { type: String },
    },
    quantity: { type: Number, default: 1 },
    selectedColor: { type: String },
    selectedSize: { type: String },
    email: { type: String, required: true },
    paid: { type: Boolean, default: false },
    transactionId: { type: String, default: false }
})
const AddToCart = mongoose.model('AddToCart', addToCartSchema)
module.exports = AddToCart;
