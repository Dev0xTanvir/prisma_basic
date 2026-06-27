import { Router } from "express";
import { usercontroller } from "./user.controller";

const router = Router();

router.post("/register", usercontroller.rigesteruser);

export const userroute = router;
