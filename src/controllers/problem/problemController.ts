import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { round } from "lodash";

const createProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      adminUserId,
      title,
      industry,
      contact,
      status,
      note,
      processingDate,
    } = req.body;

    const problem = await prisma.problem.create({
      data: {
        adminUserId,
        title,
        industry,
        contact,
        status,
        note,
        processingDate,
      },
    });
    res.status(201).json({
      message: "Problem created",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      adminUserId,
      title,
      industry,
      contact,
      status,
      note,
      processingDate,
    } = req.body;
    const problem = await prisma.problem.update({
      where: {
        id: Number(id),
      },
      data: {
        adminUserId,
        title,
        industry,
        contact,
        status,
        note,
        processingDate,
      },
    });
    res.status(200).json({
      message: "Problem updated",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.query;
    const idArray = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];
    const problem = await prisma.problem.deleteMany({
      where: {
        id: {
          in: idArray,
        },
      },
    });
    res.status(200).json({
      message: "Problem deleted",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const take = limit;
    const skip = (page - 1) * limit;
    const problems = await prisma.problem.findMany({
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalProblem = await prisma.problem.count();

    const problemsPromise = await Promise.all(
      problems.map(async (problem) => {
        const processingDate = new Date(problem.processingDate);
        const createdAt = new Date(problem.createdAt);
        // Calculate the difference in days
        const timeDifference = processingDate.getTime() - createdAt.getTime();
        const differenceInDays = timeDifference / (1000 * 3600 * 24);
        return {
          ...problem,
          waitingDate: round(differenceInDays),
        };
      })
    );

    res.status(200).json({
      message: "Problem fetched successfully",
      data: {
        problems: problemsPromise,
        meta: {
          page,
          limit,
          total: totalProblem,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const problem = await prisma.problem.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      message: "Problem fetched successfully",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};
export {
  createProblem,
  deleteProblems,
  getAllProblem,
  getProblemById,
  updateProblem,
};
