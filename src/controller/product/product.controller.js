import prisma from "../../config/prisma.js";

export const createProduct = async (req, res) => {
  const { name, description, price, stock, subcategoryId } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
        subcategoryId: subcategoryId,
      },
    });

    console.log(product);

    res.status(201).json({
      sucess: true,
      message: "Product created Successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
