const Store = require("../model/Store");


module.exports.addStoreServices = async (email, data) => {

    // Check if the user already has a store
    const existingStore = await Store.findOne({ email: email });

    if (existingStore) {
        return { error: 'User already has a store' };
    }

    const result = await Store.create(data)
    console.log(result, "dataa")
    return result;
}

module.exports.getStoreService = async () => {
  const result = await Store.find({ status: "active" })
    // .populate({
    //   path: "products",
    //   select: "-imageUrls",
    // })
    .populate({
      path: "seller",
      select: "-password -role  -_id",
    });
  // console.log(result,'getStoreService')
  return result;
};
module.exports.getStoreByEmailService = async (sellerEmail) => {
  const result = await Store.findOne({ email: sellerEmail });
  return result;
};

module.exports.getStoreServiceById = async (id) => {
  console.log(id);
  const result = await Store.findOne({ _id: id });
  return result;
};

module.exports.updateStoreService = async (storeId, data) => {
    console.log(data, "Update")
    const result = await Store.updateOne({ _id: storeId }, { $set: data }, { runValidators: true })

    // const product =await Product.findById(productId)
    // const result = await product.set(data).save()

    return result;
}

exports.deleteStoreService = async (id) => {
    const result = await Store.deleteOne({ _id: id })

    return result
}