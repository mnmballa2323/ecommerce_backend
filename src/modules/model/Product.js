const mongoose = require("mongoose");

// Schema Design
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this product"],
      trim: true,
      minLength: [3, "Name must be at list 3 characters"],
      maxLength: [100, "Name is too learge"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can't be negative"],
      max: 1000000,
    },
    description: {
      type: String,
      required: true,
      // maxLength: [500, "Description is too learge"]
    },
    unit: {
      type: String,
      required: true,
      enum: {
        values: [
          "Kg",
          "Liters",
          "Pcs",
          "Bag",
          "Boxes",
          "Centimeters",
          "Dozens",
          "Gallons",
          "Grams",
          "Inches",
          "Meters",
          "Milliliters",
          "Ounces",
          "Pairs",
          "Pieces",
          "Sets",
        ],
        message: "unit value can't be {VALUE}, must be kg/liters/bg /pcs",
      },
    },
    imageUrls: {
      type: [String],
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: true,
    },
    // brand: {
    //   type: String,
    //   required: true,
    // },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity can't be negative"],
      validate: {
        validator: (value) => {
          const isInteger = Number.isInteger(value);
          if (isInteger) {
            return true;
          } else {
            return false;
          }
        },
      },
      message: "Quantity must  be an integer",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["in-stock", "out-of-stock", "Discontinued"],
        message: "User can't be {VALUE}",
      },
    },
    sellCount: {
      type: Number,
    },
    size: {
      type: [String],
      required: true,
    },
    color: {
      type: [String],
      required: true,
    },
    addSizes: {
      type: [String],
      required: true,
    },
    addiColors: {
      type: [String],
      required: true,
    },
    storeRef: {
      type: String,
    },
    rating: {
      type: Number,
    },
    review: {
      type: String,
    },
    order: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store"
    },
    sellerInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    tags: {
      type: [String],
      required: true,
    },
    addWeight: {
      type: [String],
      required: true,
    },
    shopId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// mongoose middleware for saving data
productSchema.pre("save", function (next) {
  if (this.quantity == 0) {
    this.status = "out-of-stock";
  }
  next();
});

// productSchema.post('save', function (doc, next) {
//     console.log('after saving data')
//     next()
// })

// Our build in instance method
// productSchema.methods = {
//     findUnitByKg: function () {
//         return Product.find({ unit: 'kg' })
//     }
// }

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
