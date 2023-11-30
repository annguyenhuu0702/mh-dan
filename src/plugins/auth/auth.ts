import { Admin, AdminUser } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

const createToken = (user: Admin | AdminUser) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "24d",
  });
};

export { comparePassword, createToken, hashPassword };
