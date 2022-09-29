import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import { Canvacord } from "canvacord";

/**
 * @swagger
 * /filters/pixelate:
 *   get:
 *     summary: Pixelate an image
 *     tags: [Filters]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: The image url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pixels
 *         description: Pixels
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
        const { image, pixels } = req.query;
        if (!image || !pixels) return ResponseUtil.missingParams(res, "image", "pixels");
        if (isNaN(Number(pixels))) return ResponseUtil.badRequest(res, "pixels must be a number");
        const buffer = await Canvacord.pixelate(image as string, Number(pixels));
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
