import { Router } from "express";
import {
  createProblem,
  deleteProblems,
  getAllProblem,
  getProblemById,
  updateProblem,
} from "../controllers/problem";
import { adminMiddleware } from "../middlewares/auth/adminMiddleware";
import { problemMiddleware } from "../middlewares/auth/problemMiddleware";

export const problemRouter = Router();

problemRouter.post("/create", [adminMiddleware], createProblem);
problemRouter.post("/update/:id", [problemMiddleware], updateProblem);
problemRouter.delete("/delete", [adminMiddleware], deleteProblems);
problemRouter.get("/", [problemMiddleware], getAllProblem);
problemRouter.get("/:id", [problemMiddleware], getProblemById);
