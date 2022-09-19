import { Request, Response } from "express";
import { Canvacord } from "canvacord";
import ResponseUtil from "../../utils/ResponseUtil";

/**
 * @swagger
 * /generators/clyde:
 *   get:
 *     summary: Generates a clyde image
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: text
 *         description: The text content
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The buffer containing the image data
 *         image/png:
 *           schema:
 *             type: binary
 */

export default async (req: Request, res: Response): Promise<any> => {
    try {
        const { text } = req.query;
        if (!text) return ResponseUtil.missingParams(res, "text");
        const buffer = await Canvacord.clyde(text as string);
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
