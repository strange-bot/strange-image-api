import { Request, Response, NextFunction } from "express";
import UsageLogs from "../schemas/UsageLogs";
import User from "../schemas/User";
import ResponseUtil from "../utils/ResponseUtil";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (process.env.AUTHENTICATION !== "1") return next();

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

        // validate apiKey
        const [encodedId, token] = apiKey.split(".");
        if (!encodedId || !token) return ResponseUtil.unauthorized(res, true);

        const id = Buffer.from(encodedId, "base64").toString();
        const user = User.get(id);
        if (!user) return ResponseUtil.unauthorized(res, true);
        if (user.token !== token) return ResponseUtil.unauthorized(res, true);

        // log request
        UsageLogs.add({
            user_id: user._id.toString(),
            ip: req.ip,
            method: req.method,
            endpoint: req.path,
            headers: Object.fromEntries(
                Object.entries(req.headers).filter(([key]) => key !== "authorization") // removing authorization header
            ),
            query_params: req.query,
            rateLimit: {
                limit: req.rateLimit.limit,
                current: req.rateLimit.current,
            },
        }).catch(() => {});

        return next();
    } catch (error) {
        return ResponseUtil.serverError(res, error as Error);
    }
}
