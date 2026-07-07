import { Router } from "express";
import { commentcontroller } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  commentcontroller.createcomment,
);
router.get("/author/:authorId", commentcontroller.getCommentByAuthorId);
router.get("/:commentId", commentcontroller.getCommentByCommentId);
router.put(
  "/:commentId/modarate",
  auth(ROLE.ADMIN),
  commentcontroller.modaratecomment,
);
router.patch(
  "/:commentId",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  commentcontroller.updatecomment,
);
router.delete(
  "/:commentId",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  commentcontroller.deletecomment,
);

export const commentroute = router;
