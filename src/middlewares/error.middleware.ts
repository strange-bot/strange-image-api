import { Request, Response, NextFunction } from "express";
import { logError } from "../bot/helpers/webHook";
import HttpException from "../exceptions/HttpException";

export default function errorMiddleware(error: HttpException, _req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    console.log(error);
    logError("errorMiddleware", error);
    res.status(status).send({
        success: false,
        code: status,
        message:
            "500 Internal Error, Something was error on our side and this should not happen! Please try again later.",
    });
    next();
}
