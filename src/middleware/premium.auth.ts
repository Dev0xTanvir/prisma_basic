import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../modules/utils/catchAsync";
import { prisma } from "../lib/prisma";
import { Subscriptionstatus } from "../../generated/prisma/enums";

export const premiumguard = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const premiumsubscribe = await prisma.subscription.findUniqueOrThrow({
      where: {
         userId,
      },
    });

    if (!premiumsubscribe) {
      throw new Error("premium subscribed userid not found");
    }

    if (premiumsubscribe.status !== Subscriptionstatus.ACTIVE) {
      throw new Error("subscribed user not match please subscribed");
    }
    next();
  });
};
