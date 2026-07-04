import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

// create comment
const createcomment = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

export const commentcontroller = {
    createcomment
}