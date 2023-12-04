import { NextFunction, Request, Response } from "express";
import { comparePassword, hashPassword } from "../../plugins/auth";
import { prisma } from "../../db";
import { Admin, AdminUser } from "@prisma/client";

const changePasswordAdminUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as AdminUser;
    const { currentPassword, newPassword } = req.body;
    const compareHash = comparePassword(currentPassword, user.hash);
    if (compareHash) {
      throw new Error("New password must be different from old password");
    }
    const hash = hashPassword(newPassword);
    await prisma.adminUser.update({
      where: {
        id: user.id,
      },
      data: {
        hash,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePasswordAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as Admin;
    const { currentPassword, newPassword } = req.body;
    const compareHash = comparePassword(currentPassword, user.hash);
    if (compareHash) {
      throw new Error("New password must be different from old password");
    }
    const hash = hashPassword(newPassword);
    await prisma.admin.update({
      where: {
        id: user.id,
      },
      data: {
        hash,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { changePasswordAdminUser, changePasswordAdmin };
