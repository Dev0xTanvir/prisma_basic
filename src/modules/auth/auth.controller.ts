import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { authservice } from "./auth.service";
import { sendResponce } from "../utils/sendResponce";

// login

const loginuser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accesstoken, refreshtoken } = await authservice.loginuser(payload);

    // ! token setup cookies

    // accesstoken setup

    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    // refreshtoken

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "login user sucesfull",
      data: { accesstoken, refreshtoken },
    });
  },
);

// refreshtoken

const refreshtoken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const refreshtoken = req.cookies.refreshtoken;

    const { accesstoken } = await authservice.refreshtoken(refreshtoken);

    // accesstoken setup

    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "token refresh sucesfull",
      data: { accesstoken },
    });
  },
);

export const authcontroller = {
  loginuser,
  refreshtoken,
};
