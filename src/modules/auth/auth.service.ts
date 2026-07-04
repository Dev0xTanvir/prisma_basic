import bcrypt from "bcryptjs";
import { Ilogin } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtutils } from "../utils/jwt";

// login

const loginuser = async (payload: Ilogin) => {
  const { email, password } = payload;

  // findunique field

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  //  compare password

  const ismatchpassword = await bcrypt.compare(password, user.password);

  if (!ismatchpassword) {
    throw new Error("password incorect");
  }

  // token paylode

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // ! genarated access-token

  //   const accesstoken = jwt.sign(jwtPayload, config.jwt_access_secret, {
  //     expiresIn: config.jwt_access_expire_in,
  //   } as SignOptions);

  const accesstoken = jwtutils.createtoken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in as SignOptions,
  );

  // ! genarated refresh-token

  //   const refreshtoken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
  //     expiresIn: config.jwt_refresh_expire_in,
  //   } as SignOptions);

  const refreshtoken = jwtutils.createtoken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expire_in as SignOptions,
  );

  return { accesstoken, refreshtoken };
};

// refreshToken

const refreshtoken = async (refreshtoken: string) => {
  const verifyedRefreshtoken = jwtutils.verifytoken(
    refreshtoken,
    config.jwt_refresh_secret,
  );

  if (!verifyedRefreshtoken.success) {
    throw new Error(verifyedRefreshtoken.error);
  }

  const { id } = verifyedRefreshtoken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.activestatus === "BLOCKED") {
    throw new Error("user is blocked");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accesstoken = jwtutils.createtoken(
    jwtpayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in as SignOptions,
  );

  return { accesstoken };
};

export const authservice = {
  loginuser,
  refreshtoken,
};
