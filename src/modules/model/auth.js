const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        // unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    role: {
        type: String,
        enum: {
            values: [
                'buyer',
                'seller',
                'admin',
                'unauthorized'
            ]
        },
        default: "unauthorized",
    },
    seller: { type: Boolean },
    mobile: { type: Number },
    address: { type: String },
    country: { type: String },
    city: { type: String },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female"]
        }
    },
    profile: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    confirmationToken: String,
    confirmationTokenExpires: Date,
});

UserSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.confirmationToken = token;

  const date = new Date();

  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpires = date;

  return token;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
