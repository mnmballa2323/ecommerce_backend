const Store = require("../model/Store")
const { addStoreServices, getStoreService, getStoreServiceById, updateStoreService, deleteStoreService, getStoreByEmailService } = require("../services/store.service")


module.exports.addStore = async (req, res, next) => {
    console.log(req.body, "dataaaa")
    try {
        const { id } = req.params
        const data = req.body
        const result = await addStoreServices(id, data)

        res.status(200).json({
            status: "success",
            message: "Insert Store info successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Store info couldn't insert successfully",
            error: error.message
        })
    }
}


module.exports.getStoreByEmail = async (req, res) => {
    try {
        const email = req.params.email
        // console.log(email, 'userEmail')
        const result = await getStoreByEmailService(email)
        // console.log(result, 'getStoreByEmail')
        res.status(200).json({
            status: "success",
            message: "get store successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get store successfully",
            error: error.message
        })
    }
}

module.exports.getAllStore = async (req, res) => {
    try {
        // console.log('bal getStore')
        const result = await getStoreService()
        // console.log(result, 'getStore')
        res.status(200).json({
            status: "success",
            message: "get store successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get store successfully",
            error: error.message
        })
    }
}

module.exports.manageAllStore = async (req, res) => {
    try {
        console.log('bal getStore')
        const result = await Store.find({ status: "active" })
        console.log(result, 'getStore')
        res.status(200).json({
            status: "success",
            message: "get store successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get store successfully",
            error: error.message
        })
    }
}

module.exports.getStoreById = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const result = await getStoreServiceById(id);
        console.log(result);

        res.status(200).json({
            status: "Success",
            message: "Get store by id successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't not get store by id",
            error: error.message
        })
    }
}

exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateStoreService(id, req.body)
        res.status(200).json({
            status: "Success",
            message: "Store Update Successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Store couldn't Update Successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}


exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params
        console.log({id});
        const result = await deleteStoreService(id);
        console.log({result});

        if (!result.deletedCount) {
            return res.status(400).json({
                status: "fail",
                error: "Could't delete the store"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "Store Delete Successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Store couldn't Delete Successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}