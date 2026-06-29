import { Router } from "express";
import { authcontroller } from "./auth.controller";

const router = Router();

router.post("/login", authcontroller.loginuser);

export const authroute = router;
