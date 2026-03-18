import prisma from "../../config/prisma.js"
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";


export const getuser = async (req, res) => {
    try {
        const userGet = await prisma.user.findMany()

        if (!userGet) {
            console.log("Error Occured");
            return sendErrorResponse(res, false, 500, "Failed to Fetch");
        }
       const emailList = userGet.map(element => element.email);

        return sendSuccessResponse(res, true, 201, "User Fetched Successful.", emailList);

    } catch (error) {
        console.log(error);
        return sendErrorResponse(res, false, 501, "failed to fetch");
    }
}

export const getProfile = async (req, res) => {
    try {
        const userDetails = {
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
            address: req.user.address,
            cart: req.user.cart,
            orders: req.user.orders,
            id: req.user.id,
            createdAt: req.user.createdAt,
        }
        console.log("User Details: ", userDetails);

        return sendSuccessResponse(res, true, 200, "Successful Fetched.", userDetails);

    } catch (error) {
        console.error("Something went wrong in getProfile", error);
        return sendErrorResponse(res, false, 400, "Something went wrong inside getProfile.");
    }
}
