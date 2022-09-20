import { Request, Response, NextFunction } from "express";
import config from "../../config";
import ResponseUtil from "../utils/ResponseUtil";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!config.AUTH) return next();

    try {
        // get apiKey
        let apiKey = null;
        if (req.headers.authorization) {
            const authorization = req.headers.authorization.split(" ");
            if (authorization[0] === "Bearer") apiKey = authorization[1] as string;
        } else if (req.query.apiKey) {
            apiKey = req.query.apiKey as string;
        }

        // missing apiKey
        if (!apiKey) return ResponseUtil.unauthorized(res);

        // TODO: validate apiKey

        // TODO: increment usage

        return next();
    } catch (error) {
        return ResponseUtil.serverError(res, error as Error);
    }
}
