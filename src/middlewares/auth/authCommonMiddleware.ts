import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../request-handlers";
import { prisma } from "../../db";
import jwt from "jsonwebtoken";
import { omit } from "lodash";

const authCommonMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1] || "";
    const { id } = jwt.decode(accessToken) as { id: number };
    const admin = await prisma.admin.findUnique({
      where: {
        id,
      },
    });
    if (admin) {
      req.user = omit(
        {
          ...admin,
          role: "superAdmin",
        },
        ["hash"]
      );
      return next();
    }
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        id,
      },
    });
    if (adminUser) {
      req.user = omit(adminUser, ["hash"]);
      return next();
    }
    throw new BadRequest({
      message: "Unauthorized",
    });
  } catch (error) {
    return res.status(401).send({ error: "Unauthenticated!" });
  }
};

export { authCommonMiddleware };
