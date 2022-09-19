import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import CanvasUtil from "../../utils/CanvasUtil";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /overlays/to-be-continued:
 *   get:
 *     summary: Draws an image with the "To Be Continued..." arrow
 *     tags: [Overlays]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: A URL to an image
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

        const template = await loadImage(Util.loadAsset("generators/to-be-continued.png"));
        const data = await loadImage(image as string);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        CanvasUtil.drawImageWithTint(ctx, data, "#704214", 0, 0, data.width, data.height);
        const ratio = template.width / template.height;
        const width = canvas.width / 2;
        const height = Math.round(width / ratio);
        ctx.drawImage(template, 0, canvas.height - height, width, height);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
