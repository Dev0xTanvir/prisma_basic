import { Router } from "express";
import { postcontroller } from "./post.controller";
import { auth } from "../../middleware/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  postcontroller.createpost,
);

router.get("/", postcontroller.getallpost);

router.get("/status", auth(ROLE.ADMIN), postcontroller.getpoststatus);

router.get(
  "/my-posts",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  postcontroller.getmypost,
);

router.get("/:postId", postcontroller.getpostmyid);
router.patch(
  "/:postId",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  postcontroller.updatepost,
);

router.delete(
  "/:postId",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  postcontroller.deletepost,
);

export const postroute = router;
