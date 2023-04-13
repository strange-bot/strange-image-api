import { Response } from "express";

export default class ResponseUtil {
    static success(res: Response, buffer: Buffer) {
        if (Buffer.byteLength(buffer) > 8e6) {
            return ResponseUtil.payloadTooLarge(res);
        }
        res.setHeader("Content-Type", "image/png");
        return res.status(200).send(buffer);
    }

    static unauthorized(res: Response, isInvalid: boolean = false) {
        return res.status(401).json({
            success: false,
            code: 401,
            message: `401 Unauthorized, ${isInvalid ? "Invalid" : "Missing"} API Key.`,
        });
    }

    static missingParams(res: Response, ...args: string[]) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: "400 Bad Request, Missing one or more of the following query parameters: " + args.join(", "),
        });
    }

    static badRequest(res: Response, message: string) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: message,
        });
    }

    static payloadTooLarge(res: Response) {
        return res.status(413).json({
            success: false,
            code: 413,
            message: "413 Payload Too Large, The resulting image was too large!",
        });
    }

    static serverError(res: Response, err: Error) {
        console.log(err);
        return res.status(500).json({
            success: false,
            code: 500,
            message:
                "500 Internal Error, Something was error on our side and this should not happen! Please try again later.",
        });
    }
}
