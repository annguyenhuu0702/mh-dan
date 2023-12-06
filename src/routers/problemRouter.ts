import { Router } from "express";
import {
  createProblem,
  deleteProblems,
  getAllProblem,
  getProblemById,
  problemReport,
  updateProblem,
} from "../controllers/problem";
import { adminMiddleware } from "../middlewares/auth/adminMiddleware";
import { problemMiddleware } from "../middlewares/auth/problemMiddleware";

export const problemRouter = Router();

problemRouter.post("/create", [problemMiddleware], createProblem);
problemRouter.put("/update/:id", [problemMiddleware], updateProblem);
problemRouter.delete("/delete", [adminMiddleware], deleteProblems);
problemRouter.get("/", [problemMiddleware], getAllProblem);
problemRouter.get("/:id", [problemMiddleware], getProblemById);
problemRouter.get("/report", [adminMiddleware], problemReport);
