import httpstatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

// create comment
const createcomment = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// get comment by author id
const getCommentByAuthorId = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// get comment by comment id

const getCommentByCommentId = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// updatecomment 
const updatecomment = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// deletecomment

const deletecomment = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})

// modaratecomment
const modaratecomment = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    
})


export const commentcontroller = {
    createcomment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updatecomment,
    deletecomment,
    modaratecomment
}