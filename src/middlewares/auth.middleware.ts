import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { ApiResponse, ResponseStatus } from "../utils/api.response";
import { Officer } from "../models/officer.model";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json(ApiResponse.error("Unauthorized: Token missing"));
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await Officer.findById(decoded.id);
    if (!user || user.isDeleted) {
      res
        .status(401)
        .json(ApiResponse.error("Unauthorized: User not found or deleted"));
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json(ApiResponse.error("Unauthorized: Invalid token"));
    return;
  }
};
// Middleware to check if the user is an admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.isAdmin) {
    next();
    return;
  }

  res
    .status(403)
    .json(
      ApiResponse.error(
        "Forbidden: Admins only",
        undefined,
        ResponseStatus.ERROR
      )
    );
  return;
};

// Middleware to validate incoming requests against a DTO-----
export const validateRequest =
  (Dto: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = Object.fromEntries(
        Object.entries(errors.mapped()).map(([key, value]) => [key, value.msg])
      );
      res.status(400).json(ApiResponse.validationError(formattedErrors));
    }

    try {
      const instance = new Dto(req.body);
      next();
    } catch (error: any) {
      res
        .status(400)
        .json(
          ApiResponse.error("Invalid request data", { error: error.message })
        );
    }
  };
