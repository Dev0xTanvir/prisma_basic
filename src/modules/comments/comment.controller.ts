import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { commentservice } from "./comment.service";
import { sendResponce } from "../utils/sendResponce";

// create comment
const createcomment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await commentservice.createcomment(id as string, payload);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.CREATED,
      massege: "comment create sucesfull",
      data: result,
    });
  },
);

// get comment by author id
const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.id;

    const comment = await commentservice.getCommentByAuthorId(id as string);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "comment id get sucesfull",
      data: comment,
    });
  },
);

// get comment by comment id

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params?.commentId;

    const result = await commentservice.getcommentid(commentId as string);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "comment id get sucesfull",
      data: result,
    });
  },
);

// updatecomment
const updatecomment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params?.commentId
    const payload = req.body
    const authorId = req.user?.id

    const update = await commentservice.updatecomment(commentId as string, payload,authorId as string)

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "comment update sucesfull",
      data: update,
    });

  },
);

// deletecomment

const deletecomment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params?.commentId
    const authorId = req.user?.id

   await commentservice.deletecomment(commentId as string,authorId as string)

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "comment delete sucesfull",
      data: null,
    });

  },
);

// modaratecomment
const modaratecomment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params?.commentId
    const payload = req.body

    const modarateupdate = await commentservice.modaratecomment(commentId as string,payload)

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "comment modarate sucesfull",
      data: modarateupdate,
    });
  },
);

export const commentcontroller = {
  createcomment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updatecomment,
  deletecomment,
  modaratecomment,
};
