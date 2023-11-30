import { Router } from "express";
import { adminUserRouter } from "./adminUserRouter";
import { adminRouter } from "./adminRouter";
import { authRouter } from "./auth";
import { departmentRouter } from "./departmentRouter";

export const rootRouter = Router();

rootRouter.use("/admin-user", adminUserRouter);
rootRouter.use("/admin", adminRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/department", departmentRouter);
