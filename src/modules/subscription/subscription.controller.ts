import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { subscriptionservice } from "./subscription.service";
import { sendResponce } from "../utils/sendResponce";

// checkout controller

const createsubscription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionservice.createsubscription(
      userId as string,
    );

    
    sendResponce(res, {
      success: true,
      statuscode: httpstatus.CREATED,
      massege: "subscription create sucesfull",
      data: result,
    });
  },
);

// webhook 

const webhooksubscription = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const event = req.body 
    const signature = req.headers["stripe-signature"]!

    await subscriptionservice.webhooksubscription(event,signature as string)

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "webhook create sucesfull",
      data: null,
    });

})

export const subscriptioncontroller = {
  createsubscription,
  webhooksubscription,
};
