import { Request, Response, NextFunction } from "express";
import UsageLogs from "../schemas/UsageLogs";
import Logger from "../utils/Logger";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // skip logging localhost
    if (req.hostname.includes("localhost")) return next();

    const start = Date.now();

    // Save the original response.send function
    const originalSend = res.send;

    res.send = function (body?: any): Response<any> {
        const response = originalSend.call(this, body);
        const ip = (
            (req.headers["cf-connecting-ip"] ||
                req.headers["x-forwarded-for"] ||
                req.socket.remoteAddress ||
                "") as string
        )
            .split(",")[0]
            .trim();

        UsageLogs.add({
            user_id: req.session.userId,
            hostname: req.hostname,
            ip,
            method: req.method,
            httpVersion: req.httpVersion,
            endpoint: req.path,
            headers: Object.fromEntries(
                Object.entries(req.headers).filter(
                    ([key]) =>
                        [
                            "cf-connecting-ip",
                            "cf-ipcountry",
                            "cf-ray",
                            "user-agent",
                            "x-forwarded-for",
                            "x-real-ip",
                        ].includes(key.toLowerCase()), // only log these headers
                ),
            ),
            query_params: Object.fromEntries(Object.entries(req.query).filter(([key]) => key !== "apiKey")), // filter apiKey
            res: {
                statusCode: res.statusCode,
                time: Date.now() - start,
                headers: Object.fromEntries(
                    Object.entries(response.getHeaders()).filter(([key]) =>
                        [
                            "content-length",
                            "content-type",
                            "server",
                            "x-ratelimit-limit",
                            "x-ratelimit-remaining",
                        ].includes(key.toLowerCase()),
                    ),
                ),
            },
        }).catch((err) => Logger.error("Failed to log request", err));
        return response;
    };

    next();
}
