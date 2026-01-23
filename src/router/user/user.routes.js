
import { Router } from "express";
import { register } from "../../controller/user/register.controller.js";
import { getuser } from "../../controller/user/getuser.controller.js";
import { login } from "../../controller/user/login.controller.js";

const router = Router();

router.post("/create-user", register)
router.get("/get-user", getuser)
router.post("/login", login)

export default router;