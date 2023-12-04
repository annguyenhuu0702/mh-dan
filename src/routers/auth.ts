import { Request, Response, Router } from "express";
import passport from "passport";
import { authCommonMiddleware } from "../middlewares/auth";
import { omit } from "lodash";
import {
  changePasswordAdmin,
  changePasswordAdminUser,
} from "../controllers/authController.ts/authController";

export const authRouter = Router();

authRouter.post(
  "/login",
  [passport.authenticate("local", { session: false })],
  (req: Request, res: Response) => {
    res.status(200).json({ message: "Success", data: req.user });
  }
);

authRouter.get(
  "/profile",
  [authCommonMiddleware],
  (req: Request, res: Response) => {
    res
      .status(200)
      .json({ message: "Success", data: omit(req.user, ["hash"]) });
  }
);

authRouter.put(
  "/admin/change-password",
  [authCommonMiddleware],
  changePasswordAdmin
);
authRouter.put(
  "/admin-user/change-password",
  [authCommonMiddleware],
  changePasswordAdminUser
);
