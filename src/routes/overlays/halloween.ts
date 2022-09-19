import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /overlays/halloween:
 *   get:
 *     summary: Draws an image over a halloween border
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

        const template = await loadImage(Util.loadAsset("generators/halloween.png"));
        const avatar = await loadImage(image as string);
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(avatar, 0, 0, template.width, template.height);
        ctx.drawImage(template, 0, 0);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
