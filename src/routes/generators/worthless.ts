import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /generators/worthless:
 *   get:
 *     summary: Draws an image over Gravity Falls "Oh, this? This is worthless." meme
 *     tags: [Generators]
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

        const template = await loadImage(Util.loadAsset("generators/worthless.png"));
        const avatar = await loadImage(image as string);
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0);
        ctx.rotate(6 * (Math.PI / 180));
        ctx.drawImage(avatar, 496, 183, 400, 400);
        ctx.rotate(1.9);
        ctx.rotate(0.87);
        ctx.drawImage(avatar, -630, -1710, 120, 75);
        ctx.rotate(-6 * (Math.PI / 180));
        const buffer = canvas.toBuffer("image/jpeg", { quality: 0.5 });

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
