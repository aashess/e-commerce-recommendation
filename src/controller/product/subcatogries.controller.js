import prisma from "../../config/prisma.js"
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const createSubcatogries = async (req, res) => {
    const {name, categoriesId} = req.body;

    try {
        const response = await prisma.Subcategory.create({
            data: {
                name: name,
                categoryId: categoriesId
            }
        });

        return sendSuccessResponse(res, true, 201, "Subcategories created successfully", response);
    } catch (error) {
        return sendErrorResponse(res, false, 500, error.message);
    }
}

export const getAllSubCategories = async (req,res) => {

    try {
        const response = await prisma.subcategory.findMany();
        console.log(response);

        return sendSuccessResponse(res, true, 200, "Subcategories fetched successfully", response);

    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, false, 500, error.message);
    }
}
