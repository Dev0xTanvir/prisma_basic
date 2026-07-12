import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import { userroute } from "./modules/user/user.route";
import { authroute } from "./modules/auth/auth.route";
import { postroute } from "./modules/post/post.route";
import { commentroute } from "./modules/comments/comment.route";
import { notfound } from "./middleware/notfound";
import { globalErrorHandaler } from "./middleware/globalErrorHandaler";
import { subscriptionroute } from "./modules/subscription/subscription.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userroute);
app.use("/api/auth", authroute);
app.use("/api/post", postroute);
app.use("/api/comment", commentroute);
app.use("/api/subscription", subscriptionroute);

app.use(notfound);

app.use(globalErrorHandaler);

export default app;
