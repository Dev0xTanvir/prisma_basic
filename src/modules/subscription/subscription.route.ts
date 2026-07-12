import { ROLE } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { subscriptioncontroller } from "./subscription.controller";
import { Router } from "express";

const router = Router();

router.post(
  "/create-checkout",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  subscriptioncontroller.createsubscription,
);

export const subscriptionroute = router;
