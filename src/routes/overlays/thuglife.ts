import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import CanvasUtil from "../../utils/CanvasUtil";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /overlays/thuglife:
 *   get:
 *     summary: Draws "Thug Life" over an image
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

        const template = await loadImage(Util.loadAsset("generators/thug-life.png"));
        const data = await loadImage(image as string);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        CanvasUtil.greyscale(ctx, 0, 0, data.width, data.height);
        const ratio = template.width / template.height;
        const width = data.width / 2;
        const height = Math.round(width / ratio);
        ctx.drawImage(template, data.width / 2 - width / 2, data.height - height, width, height);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
