import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<any> => {
    return res.json({
        success: true,
        code: 200,
        message: "Request object",
        data: {
            baseUrl: req.baseUrl,
            body: req.body,
            cookies: req.cookies,
            headers: req.headers,
            hostname: req.hostname,
            httpVersion: req.httpVersion,
            httpVersionMajor: req.httpVersionMajor,
            httpVersionMinor: req.httpVersionMinor,
            ip: req.ip,
            ips: req.ips,
            method: req.method,
            originalUrl: req.originalUrl,
            params: req.params,
            path: req.path,
            protocol: req.protocol,
            rateLimit: req.rateLimit,
            query: req.query,
            secure: req.secure,
            subdomains: req.subdomains,
            trailers: req.trailers,
            url: req.url,
            xhr: req.xhr,
        },
    });
};
