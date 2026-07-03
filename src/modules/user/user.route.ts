import { Router } from "express";
import { usercontroller } from "./user.controller";

import { ROLE } from "../../../generated/prisma/enums";

import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", usercontroller.rigesteruser);

router.get("/getme", auth(ROLE.ADMIN,ROLE.USER,ROLE.AUTHOR), usercontroller.getmeuser);

export const userroute = router;
