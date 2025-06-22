
const { sendMailWithGmail } = require("../middleware/sendEmail");
const AddToCart = require("../model/addToCart");
const Payment = require("../model/payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);




exports.createPaymentService = async (amount) => {
    const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: [
            "card"
        ],
    })

    console.log(payment, 'payment payment')

    return payment;
}


module.exports.getAdminAllPaymentService = async () => {
    const results = await Payment.find({});


    const processedResults = results.map(payment => {
        const category = payment.category.split(" ")[0];
        const transactionId = payment.transactionId.slice(0, 9);
        const price = parseFloat(payment.price) || 0;
        const discount = parseFloat(payment.discount) || 0;
        const discountAmount = (discount / 100) * price;
        const discountedPrice = price - discountAmount;
        const subTotal = discountedPrice * payment.quantity;


        return {
            ...payment.toObject(),
            discountedPrice,
            subTotal,
            transactionId,
            category
        };
    });


    return processedResults;
}


// Buyer:-
module.exports.getPaymentService = async (userEmail) => {
    const results = await Payment.find({ 'formData.email': userEmail });

    const processedResults = results.map(payment => {
        const category = payment.category.split(" ")[0];
        const transactionId = payment.transactionId.slice(0, 9);
        const price = parseFloat(payment.price) || 0;
        const discount = parseFloat(payment.discount) || 0;
        const discountAmount = (discount / 100) * price;
        const discountedPrice = price - discountAmount;
        const subTotal = discountedPrice * payment.quantity;


        return {
            ...payment.toObject(),
            discountedPrice,
            subTotal,
            transactionId,
            category
        };
    });


    return processedResults;
}


module.exports.getAllPaymentService = async (userEmail) => {
    const results = await Payment.find({ sellerEmail: userEmail });

    const processedResults = results.map(payment => {
        const category = payment.category.split(" ")[0];
        const transactionId = payment.transactionId.slice(0, 9);
        const price = parseFloat(payment.price) || 0;
        const discount = parseFloat(payment.discount) || 0;
        const discountAmount = (discount / 100) * price;
        const discountedPrice = price - discountAmount;
        const subTotal = discountedPrice * payment.quantity;


        return {
            ...payment.toObject(),
            discountedPrice,
            subTotal,
            transactionId,
            category
        };
    });


    return processedResults;
};


module.exports.calculateMonthlyStatisticsService = async (sellerEmail) => {
    const monthlyStats = await Payment.aggregate([
        {
            $match: { sellerEmail: sellerEmail } // Filter by seller email
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$formData.date" } },
                income: { $sum: { $multiply: ["$price", "$quantity"] } }, // Calculate income
                expenses: { $sum: { $multiply: ["$price", "$quantity", { $divide: ["$discount", 100] }] } }, // Calculate expenses considering discount
                count: { $sum: 1 } // Count new orders
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id",
                income: 1,
                expenses: 1,
                count: 1,
                averageOrderValue: { $divide: ["$income", "$count"] }, // Calculate average order value
                revenue: { $add: ["$income", "$expenses"] }, // Calculate revenue
                profit: { $subtract: ["$income", "$expenses"] } // Calculate profit
            }
        }
    ]);


    return monthlyStats;
}


module.exports.calculateYearlyStatisticsService = async (sellerEmail) => {
    const yearlyStats = await Payment.aggregate([
        {
            $match: { sellerEmail: sellerEmail } // Filter by seller email
        },
        {
            $group: {
                _id: {
                    year: { $dateToString: { format: "%Y", date: "$formData.date" } },
                    orderID: "$_id" // Group by order ID to count orders
                },
                income: { $sum: { $multiply: ["$price", "$quantity"] } }, // Calculate income
                expenses: { $sum: { $multiply: ["$price", "$quantity", { $divide: ["$discount", 100] }] } }, // Calculate expenses considering discount
                salesVolume: { $sum: "$quantity" } // Calculate sales volume
            }
        },
        {
            $group: {
                _id: "$_id.year",
                income: { $sum: "$income" },
                expenses: { $sum: "$expenses" },
                profit: { $sum: { $subtract: ["$income", "$expenses"] } }, // Calculate profit
                totalOrderValue: { $sum: { $add: ["$income", "$expenses"] } }, // Calculate total order value
                totalOrders: { $sum: 1 }, // Count the number of orders
                salesVolume: { $sum: "$salesVolume" } // Calculate total sales volume
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id",
                income: 1,
                expenses: 1,
                profit: 1,
                totalOrderValue: 1,
                totalOrders: 1,
                salesVolume: 1,
                incomePercentage: { $multiply: [{ $divide: ["$income", "$totalOrderValue"] }, 100] },
                expensesPercentage: { $multiply: [{ $divide: ["$expenses", "$totalOrderValue"] }, 100] },
                orderPercentage: { $multiply: [{ $divide: ["$profit", "$totalOrderValue"] }, 100] } // Calculate order percentage (profit margin)
            }
        }
    ]);
    return yearlyStats;
}




module.exports.calculateQuarterlyStatisticsService = async (sellerEmail) => {
    const quarterlyStats = await Payment.aggregate([
        {
            $match: { sellerEmail: sellerEmail } // Filter by seller email
        },
        {
            $group: {
                _id: {
                    quarter: {
                        $let: {
                            vars: {
                                month: { $month: { $toDate: "$formData.date" } },
                                year: { $year: { $toDate: "$formData.date" } }
                            },
                            in: {
                                $concat: [
                                    "Q",
                                    {
                                        $cond: [
                                            { $lte: ["$$month", 3] },
                                            "1",
                                            {
                                                $cond: [
                                                    { $lte: ["$$month", 6] },
                                                    "2",
                                                    {
                                                        $cond: [
                                                            { $lte: ["$$month", 9] },
                                                            "3",
                                                            "4"
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "-",
                                    { $toString: "$$year" }
                                ]
                            }
                        }
                    },
                    category: "$category"
                },
                value: { $sum: { $multiply: ["$price", "$quantity"] } },
            }
        },
        {
            $group: {
                _id: "$_id.quarter",
                categories: { $push: { category: "$_id.category", value: "$value" } }
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                categories: 1
            }
        }
    ]);


    // Hardcoded trend values for each quarter
    const trendValues = [14.46, -4.19, 12.88, 50.14];


    // Assigning trend values to quarterly statistics
    const quarterStatistics = quarterlyStats.map((quarter, index) => ({
        name: quarter.name,
        ...quarter,
        trend: trendValues[index]
    }));


    return quarterStatistics;
};


module.exports.getSinglePaymentService = async (id) => {
    const singlePayment = await Payment.findOne({ _id: id });
    const price = parseFloat(singlePayment.price) || 0;
    const discount = parseFloat(singlePayment.discount) || 0;
    const discountAmount = (discount / 100) * price;
    const discountedPrice = price - discountAmount;
    const shipping = discountedPrice >= 50000 ? 0 : 15;
    const subTotal = discountedPrice * singlePayment.quantity;
    const total = subTotal + shipping;


    return {
        ...singlePayment.toObject(),
        discountedPrice,
        shipping,
        subTotal,
        total
    };
};


exports.updatePaymentService = async (payments) => {


    // Ensure payments is an array even for a single payment:-
    if (!Array.isArray(payments)) {
        payments = [payments];
    }


    // const updateOperations = payments.map(async (payment) => {
    //     const filter = { _id: ObjectId(payment.payment) };
    //     const updateDoc = {
    //         $set: {
    //             paid: true,
    //             transactionId: payment.transactionId,
    //         }
    //     };
    //     await AddToCart.updateOne(filter, updateDoc, { runValidators: true });
    // });


    // await Promise.all(updateOperations);


    const insertPayment = await Payment.insertMany(payments);


    return insertPayment
}




exports.deletePaymentService = async (id) => {
    const result = await Payment.deleteOne({ _id: id })
    return result
}

