const paginationHelpers = require('../helpers/paginationHelpers')
const Product = require('../model/Product');
const Store = require('../model/Store');
const AddToCart = require('../model/addToCart');
const Payment = require('../model/payment');


exports.getProductService = async (filters, paginationOptions) => {


    const { searchTerm } = filters
    // const { id: ShopId } = id;


    // const andConditons = [
    //   {
    //     $or: [
    //       {
    //         name: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //       {
    //         year: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //     ],
    //   },
    // ];
    const productsSearchAbleFields = ['name', 'category', 'brand'];
    const andConditions = [];

    // Add a default condition if andConditions is empty
    if (andConditions.length === 0) {
        andConditions.push({});
    }


  if (searchTerm) {
    andConditions.push({
      $or: productsSearchAbleFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // const { page = 1, limit = 10 } = paginationOptions
  // const skip = (page - 1) * limit

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const products = await Product.find({ $and: andConditions })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

    const total = await Product.estimatedDocumentCount()
    return {
        meta: {
            page,
            limit,
            total
        },
        data: products
    };
}

exports.getProductByShopService = async (filters, paginationOptions, id) => {
  const { searchTerm } = filters;
  // const { id: ShopId } = id;

  // const andConditons = [
  //   {
  //     $or: [
  //       {
  //         name: {
  //           $regex: searchTerm,
  //           $options: 'i',
  //         },
  //       },
  //       {
  //         year: {
  //           $regex: searchTerm,
  //           $options: 'i',
  //         },
  //       },
  //     ],
  //   },
  // ];
  const productsSearchAbleFields = ["name", "category", "brand"];
  const andConditions = [];

  // Add a default condition if andConditions is empty
  if (andConditions.length === 0) {
    andConditions.push({});
  }

  // Add condition to filter by storeId
  andConditions.push({ shopId: id });

  if (searchTerm) {
    andConditions.push({
      $or: productsSearchAbleFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // const { page = 1, limit = 10 } = paginationOptions
  // const skip = (page - 1) * limit

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const products = await Product.find({ $and: andConditions })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments({ shopId: id });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: products,
  };
};
// desc/asc

exports.addProductService = async (data, storeId) => {
  try {
    console.log(storeId, "storeID");
    console.log(data, "data");

    const product = await Product.create(data);
    const { _id: productId } = product;
    const res = await Store.updateOne(
      { _id: storeId },
      {
        $push: {
          products: productId,
        },
      }
    );
    console.log(res, "res res res");

    return product;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Re-throw the error to indicate failure
  }
};

exports.updateProductService = async (productId, data) => {
  const result = await Product.updateOne(
    { _id: productId },
    { $set: data },
    { runValidators: true }
  );

  // const product =await Product.findById(productId)
  // const result = await product.set(data).save()

  return result;
};

exports.bulkUpdateProductService = async (data) => {
  // console.log(data.ids, 'ids')
  // const result = await Product.updateMany({ _id: data.ids }, { $set: data.data }, { runValidators: true })

  const products = [];
  data.ids.forEach((product) => {
    products.push(
      Product.updateOne({ _id: product.id }, { $set: product.data })
    );
  });
  const result = await Promise.all(products);

  console.log(result);
  return result;
};

module.exports.getProductServiceById = async (id) => {
  const result = await Product.findOne({ _id: id }).populate({
    path: "sellerInfo",
    select: "-password -role  -_id -wishlist",
  });
  // console.log(result)
  return result;
};


exports.deleteProductService = async (id) => {
  const result = await Product.deleteOne({ _id: id });

  return result;
};

exports.bulkDeleteProductService = async (ids) => {
  console.log(data.ids, "ids");
  const result = await Product.deleteMany({ ids });

  console.log(result);
  return result;
};

module.exports.getTopProductsService = async (email) => {
  try {
    // Retrieve all payments with product details for the given email
    const payments = await Payment.find({ "formData.email": email });

    // Calculate total quantity sold for each product
    const productCounts = {};
    payments.forEach((payment) => {
      const { name, quantity } = payment;
      productCounts[name] = (productCounts[name] || 0) + quantity;
    });

    // Sort products by total quantity sold
    const sortedProducts = Object.entries(productCounts).sort(
      (a, b) => b[1] - a[1]
    ); // Sort in descending order of quantity sold

    // Get the top 3 products
    const topProducts = sortedProducts.slice(0, 6);

    // Retrieve the full data for the top selling products
    const topProductsData = await Promise.all(
      topProducts.map(async ([name, quantity]) => {
        const payment = await Payment.findOne({
          "formData.email": email,
          name,
        });
        return payment.toObject(); // Return the full payment data for the top selling product
      })
    );

    return {
      status: "Success",
      message: "Get top Product successfully",
      data: topProductsData,
    };
  } catch (error) {
    throw new Error(`Failed to get top products: ${error.message}`);
  }
};

