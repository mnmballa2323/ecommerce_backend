const UserModel = require("../model/auth");

module.exports.getAllBuyerServices = async (data) => {
    const result = await UserModel.find({})
    return result;
}

module.exports.getBuyerServiceById = async (id) => {
    const result = await UserModel.findOne({ _id: id })
    console.log(result)
    return result;
}

module.exports.updateBuyerService = async (storeId, data) => {
    // console.log(data,"Update")
    const result = await UserModel.updateOne({ _id: storeId }, { $set: data }, { runValidators: true })

    // const product =await Product.findById(productId)
    // const result = await product.set(data).save()

    return result;
}

exports.deleteBuyerService = async (id) => {
    const result = await UserModel.deleteOne({ _id: id })
    return result
}