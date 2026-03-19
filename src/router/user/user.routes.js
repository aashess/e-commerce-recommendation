
import { Router } from "express";
import { register, verifyEmail } from "../../controller/user/register.controller.js";
import { getProfile, getuser } from "../../controller/user/getuser.controller.js";
import { login } from "../../controller/user/login.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js"
import { authenticateAdmin } from "../../middleware/admin.middleware.js";
import { authLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = Router();

// Apply rate limiting to authentication endpoints
router.post("/register", authLimiter, register)
router.post("/login", authLimiter, login)
router.post("/verify-email", authLimiter, authenticateUser, verifyEmail)

router.get("/get-user", authenticateUser, authenticateAdmin, getuser)  //testing-purpose

router.get('/get-profile', authenticateUser, getProfile)

export default router;