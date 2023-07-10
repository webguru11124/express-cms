import { IRoute, Request, Response, NextFunction } from "express";
import { logger } from "./logger";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  try {
    logger.log({ level: "error", message: errMsg });
  } catch (e) {
    logger.log({ level: "error", message: "error while logging message" });
  }
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export { ErrorHandler };
