import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { userservice } from "./user.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponce } from "../utils/sendResponce";
import config from "../../config";
import jwt from "jsonwebtoken";
import { jwtutils } from "../utils/jwt";

// user regester

const rigesteruser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userservice.rigesteruserintodb(payload);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.CREATED,
      massege: "regestation create sucesfull",
      data: { user },
    });
  },
);

// getme

const getmeuser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const profile = await userservice.getmeuserintodb(req.user?.id as string);

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "get profile sucesfull",
      data: { profile },
    });
  },
);

export const usercontroller = {
  rigesteruser,
  getmeuser,
};
