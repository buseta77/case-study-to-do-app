import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { err } from "./error.js";

type UserData = {
  id: string;
}

// Middleware to validate JWT token
export const jwtAuth = () => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer ")) {
      return err(res, 401, "Missing or malformed authorization header");
    }

    const actualToken = token.split(" ")[1];
    if (!actualToken) {
      return err(res, 401, "Missing authorization token");
    }

    try {
      const data = jwt.verify(actualToken, process.env.JWT_SECRET_KEY!) as UserData;

      req.user = data;
      next();
    } catch (error) {
      return err(res, 401, "Invalid or expired token");
    }
  };
};

// Function to create a new JWT token
export const createToken = (data: UserData): string => {
  try {
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error while creating JWT token");
  }
};
