import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { rigesteruserpayload } from "./user.interface";

const rigesteruserintodb = async (payload: rigesteruserpayload) => {
  const { name, email, password, profilePhoto } = payload;

  const isexit = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isexit) {
    throw new Error("email already exit");
  }

  const hashpassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const createuser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashpassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createuser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createuser.id,
      email: createuser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

export const userservice = {
  rigesteruserintodb,
};
