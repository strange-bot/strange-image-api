import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import { Gay } from "discord-image-generation";

/**
 * @swagger
 * /overlays/gay:
 *   get:
 *     summary: Draws gay overlay on an image
 *     tags: [Overlays]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: The image url
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
        const { image } = req.query;
        if (!image) return ResponseUtil.missingParams(res, "image");
        const buffer = await new Gay().getImage(image as string);
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
