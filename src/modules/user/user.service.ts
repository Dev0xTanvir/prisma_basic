import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { rigesteruserpayload } from "./user.interface";

// user rigester

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

  // password hash

  const hashpassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  // user create

  const createuser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashpassword,
    },
  });

  // profile created

  await prisma.profile.create({
    data: {
      userId: createuser.id,
      profilePhoto,
    },
  });

  // find unique field and hide password responc includ profile

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

// getme

const getmeuserintodb = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

// update

const updateuserintodb = async (userId: string, payload: any) => {
  
  const { name, email, bio, profilePhoto } = payload;

  const updateuser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updateuser;
};

export const userservice = {
  rigesteruserintodb,
  getmeuserintodb,
  updateuserintodb,
};
