import { Request, Response, NextFunction } from "express";

export default function errorMiddleware(_req: Request, _res: Response, next: NextFunction) {
    // TODO: Extract details from the request

    // TODO: Log to database

    next();
}
