import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import ResponseUtil from "../../utils/ResponseUtil";

/**
 * @swagger
 * /generators/fusion:
 *   get:
 *     summary: Draws baseImage over overlayImage
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: baseImage
 *         description: The 1st image URL
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: overlayImage
 *         description: The 2nt image URL
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
        const { baseImage, overlayImage } = req.query;
        if (!baseImage || !overlayImage) {
            return ResponseUtil.missingParams(res, "baseImage", "overlayImage");
        }

        const baseAvatar = await loadImage(baseImage as string);
        const overlayAvatar = await loadImage(overlayImage as string);
        const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
        const ctx = canvas.getContext("2d");
        ctx.globalAlpha = 0.5;
        ctx.drawImage(baseAvatar, 0, 0);
        ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
