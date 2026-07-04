import { Router } from "express";
import { authcontroller } from "./auth.controller";

const router = Router();

router.post("/login", authcontroller.loginuser);
router.post("/refresh_token", authcontroller.refreshtoken);

export const authroute = router;
