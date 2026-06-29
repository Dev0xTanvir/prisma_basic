import httpstatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        massege: "regestation failed",
        success: false,
        Statuscode: httpstatus.INTERNAL_SERVER_ERROR,
      });
    }
  };
};
