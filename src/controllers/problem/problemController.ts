/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { round } from "lodash";
import { prisma } from "../../db";
import { ROLE } from "../../constants/role";
import { Problem } from "@prisma/client";
import moment from "moment";

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
      departmentId,
    } = req.body;

    const problem = await prisma.problem.create({
      data: {
        adminUserId,
        departmentId,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = req.user as any;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const take = limit;
    const skip = (page - 1) * limit;
    let problems: Problem[];
    let totalProblem: number;

    if (user.role !== ROLE.SUPER_ADMIN) {
      problems = await prisma.problem.findMany({
        take,
        skip,
        where: {
          departmentId: user.departmentId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      totalProblem = await prisma.problem.count({
        where: {
          departmentId: user.departmentId,
        },
      });
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
      return res.status(200).json({
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
    }

    problems = await prisma.problem.findMany({
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    totalProblem = await prisma.problem.count();
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
    console.log("🚀 ~ file: problemController.ts:222 ~ error:", error);
    next(error);
  }
};

const problemReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate, departmentId, industry } = req.query;

    const problems = await prisma.problem.findMany({
      where: {
        ...(startDate
          ? {
              createdAt: {
                gte: moment(startDate as string).toDate(),
              },
            }
          : {}),
        ...(endDate
          ? {
              createdAt: {
                lte: moment(endDate as string).toDate(),
              },
            }
          : {}),
        ...(departmentId
          ? {
              departmentId: Number(departmentId),
            }
          : {}),
        ...(industry
          ? {
              industry: industry as string,
            }
          : {}),
      },
    });
    res.status(200).json({
      message: "Problem fetched successfully",
      data: problems,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: problemController.ts:268 ~ error:", error);
    next(error);
  }
};

export {
  createProblem,
  deleteProblems,
  getAllProblem,
  getProblemById,
  problemReport,
  updateProblem,
};
