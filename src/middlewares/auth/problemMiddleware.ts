import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../request-handlers";
import { prisma } from "../../db";
import jwt from "jsonwebtoken";

const problemMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1] || "";
    const { id } = jwt.decode(accessToken) as { id: number };
    const admin = prisma.admin.findUnique({
      where: {
        id,
      },
    });
    if (admin) {
      req.user = admin;
      return next();
    }

    const adminUser = prisma.adminUser.findUnique({
      where: {
        id,
      },
    });
    if (adminUser) {
      req.user = adminUser;
      return next();
    }
    throw new BadRequest({
      message: "Unauthorized",
    });
  } catch (error) {
    return res.status(401).send({ error: "Unauthenticated!" });
  }
};

export { problemMiddleware };
