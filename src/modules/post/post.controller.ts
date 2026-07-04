import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

// create post
const createpost = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// getall post

const getallpost = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// getpost status

const getpoststatus = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// getmy post 

const getmypost = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// getpost myid

const getpostmyid = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// update post

const updatepost = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// delete post 

const deletepost = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

export const postcontroller = {
    createpost,
    getallpost,
    getpoststatus,
    getmypost,
    getpostmyid,
    updatepost,
    deletepost
}