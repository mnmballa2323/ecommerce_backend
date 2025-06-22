const { getAddToCartService, addToCartService, deleteAddToCartService, updateAddToCartService, incDecAddToCartService } = require("../services/addToCart.service")




module.exports.addToCart = async (req, res, next) => {
    try {
        const data = req.body
        console.log(data, 'add to cart dataaaa')
        const result = await addToCartService(data)
        console.log(result, 'add to cart result')
        res.status(200).json({
            status: "Success",
            message: "addToCart insert Successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "addToCart couldn't insert Successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}


module.exports.getAddToCart = async (req, res) => {
    try {
        const email = req?.query?.email;
        const result = await getAddToCartService(email)
        res.send(result)
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get addToCart successfully",
            error: error.message
        })
    }
}




module.exports.updateAddToCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, selectedColor, selectedSize } = req.body;
        console.log(quantity);
        const result = await updateAddToCartService(id, quantity, selectedColor, selectedSize)




        res.status(200).json({
            status: "success",
            message: "Update addToCart successfully",
            data: result
        })
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't Update add To Cart successfully",
            error: error.message
        })
    }
}


module.exports.increaseDecressAddToCart = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body;
        const result = await incDecAddToCartService(id, quantity)


        res.status(200).json({
            status: "success",
            message: "Update addToCart successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't Update add To Cart successfully",
            error: error.message
        })
    }
}


exports.deleteAddToCart = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteAddToCartService(id)


        if (!result.deletedCount) {
            return res.status(400).json({
                status: "fail",
                error: "Could't delete the product"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "Product Delete Successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Product couldn't Delete Successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}
