import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { subscriptionservice } from "./subscription.service";
import { sendResponce } from "../utils/sendResponce";

const createsubscription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionservice.createsubscription(
      userId as string,
    );

    
    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "subscription create sucesfull",
      data: result,
    });
  },
);

export const subscriptioncontroller = {
  createsubscription,
};
