import { Response } from "express";

type tmeta = {
  page: number;
  limit: number;
  total: number;
};

type tresponce<T> = {
  massege: string;
  success: boolean;
  statuscode: number;
  data: T;
  meta?: tmeta;
};

export const sendResponce = <T>(res: Response, data: tresponce<T>) => {
  res.status(data.statuscode).json({
    success: data.success,
    statuscode: data.statuscode,
    massege: data.massege,
    data: data.data,
    meta: data.meta,
  });
};