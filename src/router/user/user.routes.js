
import { Router } from "express";
import { register } from "../../controller/user/register.controller.js";
import { getuser } from "../../controller/user/getuser.controller.js";
import { login } from "../../controller/user/login.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js"
import { authenticateAdmin } from "../../middleware/admin.middleware.js";

const router = Router();

router.post("/register", register)
router.post("/login", login)

router.get("/get-user", authenticateUser, authenticateAdmin, getuser)  //testing-purpose

export default router;