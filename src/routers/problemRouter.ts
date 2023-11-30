import { Router } from "express";
import {
  createProblem,
  deleteProblems,
  getAllProblem,
  getProblemById,
  updateProblem,
} from "../controllers/problem";

export const problemRouter = Router();

problemRouter.post("/create", createProblem);
problemRouter.post("/update/:id", updateProblem);
problemRouter.delete("/delete", deleteProblems);
problemRouter.get("/", getAllProblem);
problemRouter.get("/:id", getProblemById);
