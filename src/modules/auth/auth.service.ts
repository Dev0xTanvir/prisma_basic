import bcrypt from "bcryptjs";
import { Ilogin } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import jwt, { SignOptions } from "jsonwebtoken";
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

export const authservice = {
  loginuser,
};
