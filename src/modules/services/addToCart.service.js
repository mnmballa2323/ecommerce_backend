const AddToCart = require("../model/addToCart");


exports.addToCartService = async (data) => {
    const product = await AddToCart.create(data)
    return product;
}

exports.deleteAddToCartService = async (id) => {
    const result = await AddToCart.deleteOne({ _id: id })
    return result
}

exports.updateAddToCartService = async (id, quantity, selectedColor, selectedSize) => {
    const result = await AddToCart.updateOne({ _id: id }, {
        $set: {
            quantity,
            selectedColor,
            selectedSize,
        },
    }, { runValidators: true })
    return result
}

exports.incDecAddToCartService = async (id, quantity) => {
    const result = await AddToCart.updateOne({ _id: id }, {
        $set: {
            quantity
        },
    }, { runValidators: true })
    return result
}


module.exports.getAddToCartService = async (userEmail) => {
    const result = await AddToCart.find({ email: userEmail });

    const itemsWithDiscountedPrice = result.map((item) => {
        const price = item?.cart?.price;
        const discount = item?.cart?.discount;
        const discountAmount = (price * discount) / 100;
        const discountedPrice = price - discountAmount;
        return { ...item.toObject(), discountedPrice };
    });

    return itemsWithDiscountedPrice;
}



