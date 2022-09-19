import { createCanvas, loadImage } from "canvas";
import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /overlays/approved:
 *   get:
 *     summary: Draws a "approved" stamp over an image
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

        const template = await loadImage(Util.loadAsset("generators/approved.png"));
        const data = await loadImage(image as string);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        const dataRatio = data.width / data.height;
        const baseRatio = template.width / template.height;
        let { width, height } = data;
        let x = 0;
        let y = 0;
        if (baseRatio < dataRatio) {
            height = data.height;
            width = template.width * (height / template.height);
            x = (data.width - width) / 2;
            y = 0;
        } else if (baseRatio > dataRatio) {
            width = data.width;
            height = template.height * (width / template.width);
            x = 0;
            y = (data.height - height) / 2;
        }
        ctx.drawImage(template, x, y, width, height);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
