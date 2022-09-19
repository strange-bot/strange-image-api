import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import CanvasUtil from "../../utils/CanvasUtil";
import { createCanvas, loadImage } from "canvas";

/**
 * @swagger
 * /filters/distort:
 *   get:
 *     summary: Distorts an image
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
 *         description: The level of distortion
 *         required: true
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
        if (!image || !level) return ResponseUtil.missingParams(res, "image", "level");

        const data = await loadImage(image as string);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        CanvasUtil.distort(ctx, level, 0, 0, data.width, data.height);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
