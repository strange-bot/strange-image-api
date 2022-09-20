import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";

export default function errorMiddleware(error: HttpException, _req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    res.status(status).send({ message, status });
    next();
}
