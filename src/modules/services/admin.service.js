const UserModel = require("../model/auth");

module.exports.getAllSellerServices = async (filter) => {
    const result = await UserModel.find(filter)
    return result;
}

module.exports.getSellerServiceById = async (id) => {
    const result = await UserModel.findOne({ _id: id })
    console.log(result)
    return result;
}

module.exports.updateSellerService = async (userId) => {
    const filter = { _id: userId };
    const updateDoc = {
        $set: { role: 'seller' },
    };
    const result = await UserModel.updateOne(filter, updateDoc, { runValidators: true })
    return result;
}


exports.deleteUserService = async (id) => {
    const result = await UserModel.deleteOne({ _id: id })
    return result
}

module.exports.getAdminServices = async (email) => {
    // const admin = await UserModel.find({ email: email })
    // const isAdmin = admin.role === "admin"
    // return isAdmin;
    const admin = await UserModel.findOne({ email: email }); 
    if (admin && admin.role === "admin") {
        return true;
    } else {
        return false;
    }
}
