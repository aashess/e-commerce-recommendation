import prisma from "../../config/prisma.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

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

    return sendSuccessResponse(res, true, 201, "Product created Successfully", product);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, false, 500, error.message);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return sendSuccessResponse(res, true, 200, "Products fetched successfully", products);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, false, 500, error.message);
  }
};
