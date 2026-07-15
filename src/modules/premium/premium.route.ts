import { Router } from "express";
import { premiumcontroller } from "./premium.controller";
import { auth } from "../../middleware/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  premiumcontroller.createpremium,
);

export const premiumroute = router;
