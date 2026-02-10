
import { Router } from "express";
import { googleLogin } from "../auth/googleLogin.js";
import { authCallback } from "../auth/googleCallback.js";

const router = Router()

router.get("/google/login", googleLogin);
router.get('/google/callback', authCallback)

export default router

