import { createCanvas, loadImage } from "canvas";
import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /overlays/brazzers:
 *   get:
 *     summary: Draws an image with the Brazzers logo in the corner
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

        const template = await loadImage(Util.loadAsset("generators/brazzers.png"));
        const data = await loadImage(image as string);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        const ratio = template.width / template.height;
        const width = data.width / 3;
        const height = Math.round(width / ratio);
        ctx.drawImage(template, 0, data.height - height, width, height);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
