import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../generated/prisma/enums";
import { catchAsync } from "../modules/utils/catchAsync";
import { jwtutils } from "../modules/utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        id: string;
        role: ROLE;
      };
    }
  }
}

export const auth = (...requiredRole: [ROLE]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accesstoken
      ? req.cookies.accesstoken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("user not login");
    }

    const verifyedtoken = jwtutils.verifytoken(token, config.jwt_access_secret);
    if (!verifyedtoken.success) {
      throw new Error(verifyedtoken.error);
    }

    const { email, name, id, role } = verifyedtoken.data as JwtPayload;
    
    if (requiredRole.length && !requiredRole.includes(role)) {
      throw new Error("user frobiden, you do not access permision");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("user not found");
    }

    if (user.activestatus === "BLOCKED") {
      throw new Error("your acount has been blocked");
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};
