import prisma from "../../config/prisma.js"
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const createCategories = async (req, res) => {
    const {categories} = req.body

    try {
        const product = await prisma.Category.create({
            data: {
                name: categories
            }
        });

        console.log(product);

        return sendSuccessResponse(res, true, 201, "Categories created successfully", product.id);
    } catch (error) {
        return sendErrorResponse(res, false, 500, error.message);
    }
}

export const getCategories = async (req, res) => {
    const categories = await prisma.Category.findMany();
    return sendSuccessResponse(res, true, 200, "Categories fetched successfully", categories);
}
