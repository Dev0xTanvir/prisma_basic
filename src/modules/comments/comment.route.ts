import { Router } from "express";
import { commentcontroller } from "./comment.controller";


const router = Router();

router.post("/create-comment", commentcontroller.createcomment);


export const commentroute = router;