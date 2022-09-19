import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import { Canvacord } from "canvacord";

/**
 * @swagger
 * /filters/darken:
 *   get:
 *     summary: Darkens an image
 *     tags: [Filters]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: The image url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount
 *         description: Darkness amount
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: The buffer containing the image data
 *         image/png:
 *           schema:
 *             type: binary
 */

export default async (req: Request, res: Response): Promise<any> => {
    try {
        const { image, amount } = req.query;
        if (!image || !amount) return ResponseUtil.missingParams(res, "image", "amount");
        if (isNaN(Number(amount))) return ResponseUtil.badRequest(res, "amount must be a number");
        const buffer = await Canvacord.darkness(image as string, Number(amount));
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
