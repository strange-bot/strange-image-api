import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import { Blur } from "discord-image-generation";

/**
 * @swagger
 * /filters/blur:
 *   get:
 *     summary: Blurs an image
 *     tags: [Filters]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: The image url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         description: Intensity of the blur
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
        const { image, level } = req.query;
        if (!image) return ResponseUtil.missingParams(res, "image");
        if (level && isNaN(Number(level))) return ResponseUtil.badRequest(res, "level must be a number");
        const buffer = await new Blur().getImage(image as string, Number(level));
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
