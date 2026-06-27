import httpstatus from "http-status";
import { Request, Response } from "express";
import { userservice } from "./user.service";

const rigesteruser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const user = await userservice.rigesteruserintodb(payload);

    res.status(httpstatus.CREATED).json({
      massege: "regestation create sucesfull",
      success: true,
      Statuscode: httpstatus.CREATED,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      massege: "regestation failed",
      success: false,
      Statuscode: httpstatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export const usercontroller = {
  rigesteruser,
};
