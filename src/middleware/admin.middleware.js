import { sendErrorResponse } from "../utils/responseFormat.js";

export const authenticateAdmin = async (req, res, next) => {
    const role = req.user.role
    console.log(role);

    try {
        if (role === 'ADMIN') {
            next()

        }
        else {
            return sendErrorResponse(res, false, 500, "Not Authorised to Visit! Need ADMIN Account!!");
        }
    } catch (error) {
        console.error("Something Went Wrong! inside admin.Middleware", error);
        return sendErrorResponse(res, false, 501, "Something Went Wrong inside Middleware.");
    }


}