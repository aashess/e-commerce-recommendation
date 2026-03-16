
import { Router } from "express";
import { register, verifyEmail } from "../../controller/user/register.controller.js";
import { getProfile, getuser } from "../../controller/user/getuser.controller.js";
import { login } from "../../controller/user/login.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js"
import { authenticateAdmin } from "../../middleware/admin.middleware.js";

const router = Router();

router.post("/register", register)
router.post("/login", login)
router.post("/verify-email", authenticateUser, verifyEmail)

router.get("/get-user", authenticateUser, authenticateAdmin, getuser)  //testing-purpose

router.get('/get-profile', authenticateUser, getProfile)


export default router;