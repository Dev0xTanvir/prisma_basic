import { Router } from "express";
import { usercontroller } from "./user.controller";

const router = Router();

router.post("/register", usercontroller.rigesteruser);
router.get("/getme", usercontroller.getmeuser);

export const userroute = router;
