import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandaler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  let statusCode;
  let message = err.message || "internal server error";
  let errorname = err.name || "internal server error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpstatus.BAD_REQUEST;
    message =
      "You have provided an incorrect field type or a required field is missing.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpstatus.BAD_REQUEST;
      message = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = httpstatus.BAD_REQUEST;
      message = "Foreign key constraint error.";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpstatus.INTERNAL_SERVER_ERROR;
    message = "Database initialization error.";
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpstatus.INTERNAL_SERVER_ERROR;
    message = "An error occurred during query execution.";
  }

  res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    Statuscode: statusCode || httpstatus.INTERNAL_SERVER_ERROR,
    name: errorname,
    message: message,
    error: err.stack,
  });
};
