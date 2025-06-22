const { getAllBuyerServices, deleteBuyerService } = require("../services/buyer.service")


const getAllBuyer = async (req, res, next) => {
    try {

        // const buyers = await UserModel.findOne({ role: 'buyer' })
        const buyers = await getAllBuyerServices()
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

const deleteBuyer = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteBuyerService(id)

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

module.exports.buyerController = {
    getAllBuyer,
    deleteBuyer
};
