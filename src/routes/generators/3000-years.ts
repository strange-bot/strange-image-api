import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /generators/3000-years:
 *   get:
 *     summary: Draws an image over Pokémon's "It's been 3000 years" meme
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

        const template = await loadImage(Util.loadAsset("generators/3000-years.png"));
        const avatar = await loadImage(image as string);
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0);
        ctx.drawImage(avatar, 461, 127, 200, 200);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
