import httpstatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponce } from "../utils/sendResponce";
import { premiumservice } from './premium.service';

const createpremium = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const result = await premiumservice.createpremium()

    sendResponce(res, {
      success: true,
      statuscode: httpstatus.OK,
      massege: "subscription retribe sucesfull",
      data: result,
    });
})

export const premiumcontroller = {
    createpremium,
}