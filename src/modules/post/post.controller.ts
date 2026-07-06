import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { postservice } from "./post.service";
import { sendResponce } from "../utils/sendResponce";

// create post
const createpost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const payload = req.body;

    const result = await postservice.createpost(payload, id as string);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.CREATED,
      massege: "post create sucesfull",
      data: result,
    });
  },
);

// getall post

const getallpost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await postservice.getallpost();

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "post create sucesfull",
      data: post,
    });
  },
);

// getpost status

const getpoststatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const result = await postservice.getallpoststatus();

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "post create sucesfull",
      data: result,
    });
  },
);

// getmy post

const getmypost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await postservice.getmypoststatus(authorId as string);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "mypost retrive sucesfull",
      data: result,
    });
  },
);

// getpost myid

const getpostmyid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("id not found");
    }

    const post = await postservice.getpostmyidstatus(postId as string);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "post retrive sucesfull",
      data: post,
    });
  },
);

// update post

const updatepost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params?.postId;
    const payload = req.body;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const finalupdate = await postservice.updatepoststatus(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "post update sucesfull",
      data: finalupdate,
    });
  },
);

// delete post

const deletepost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params?.postId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    await postservice.deletepoststatus(
      postId as string,
      authorId as string,
      isAdmin,
    );

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "post update sucesfull",
      data: null,
    });
  },
);

export const postcontroller = {
  createpost,
  getallpost,
  getpoststatus,
  getmypost,
  getpostmyid,
  updatepost,
  deletepost,
};
