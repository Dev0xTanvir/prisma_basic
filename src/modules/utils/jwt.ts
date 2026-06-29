import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// token genarete function

const createtoken = (
  Payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(Payload, secret, { expiresIn } as SignOptions);
  return token;
};

// token verify function

const verifytoken = (token: string, secret: string) => {
  try {
    const verifyedtoken = jwt.verify(token, secret);
    return verifyedtoken;
  } catch (error: any) {
    console.log("token verification failed", error);
    throw new Error(error.message);
  }
};

export const jwtutils = {
  createtoken,
  verifytoken,
};
