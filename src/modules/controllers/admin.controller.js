const UserModel = require("../model/auth");
const { getAdminServices, getAllSellerServices, deleteUserService } = require("../services/admin.service");
const { deleteBuyerService } = require("../services/buyer.service");



const getAllSellerRequest = async (req, res, next) => {
    try {

        // const buyers = await UserModel.findOne({ role: 'buyer' })
        const filter = {$and:[{ seller: false }, { role: 'buyer' }]}
        const buyers = await getAllSellerServices(filter)
        res.status(200).json({
            status: "Success",
            message: "All buyer get Successfully",
            data: buyers
        })

    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "All buyer couldn't found Successfully",
            error: error.message
        })
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteUserService(id)

        if (!result.deletedCount) {
            return res.status(400).json({
                status: "fail",
                error: "Could't delete the buyer"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "Buyer Delete Successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Buyer couldn't Delete Successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}

const updateSeller = async (req, res) => {

    try {
        const { id } = req.params;
        console.log(id, 'user iddddddddddd')
        const filter = { _id: id };
        const updateDoc = {
            $set: { role: 'seller', seller: true },
        };
        const result = await UserModel.updateOne(filter, updateDoc, { runValidators: true });
        res.status(200).json({
            status: "Success",
            message: "Create seller successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Couldn't make seller successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}
const updateUserRole = async (req, res) => {

    try {
        const { id } = req.params;
        console.log(id, 'userRole iddddddddddd')
        const userRole = req.body.role
        console.log(userRole, 'user userRole')
        const filter = { _id: id };
        const updateDoc = {
            $set: { role: userRole },
        };
        const result = await UserModel.updateOne(filter, updateDoc, { runValidators: true });
        res.status(200).json({
            status: "Success",
            message: "Create seller successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Couldn't make seller successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}



const getAdmin = async (req, res, next) => {
    try {
        const { email } = req.params
        console.log(email, 'admin email')
        const admin = await getAdminServices(email)
        res.status(200).json({
            status: "Success",
            message: "Admin get Successfully",
            data: admin
        })

    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Admin couldn't found Successfully",
            error: error.message
        })
    }
}


module.exports.adminController = {
    getAllSellerRequest,
    deleteUser,
    updateSeller,
    updateUserRole,
    getAdmin
};
