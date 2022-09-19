import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

/**
 * @swagger
 * /generators/kyon-gun:
 *   get:
 *     summary: Draws an image behind Kyon shooting a gun.
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

        const template = await loadImage(Util.loadAsset("generators/kyon-gun.png"));
        const avatar = await loadImage(image as string);

        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, template.width, template.height);
        const ratio = avatar.width / avatar.height;
        const width = Math.round(template.height * ratio);
        ctx.drawImage(avatar, template.width / 2 - width / 2, 0, width, template.height);
        ctx.drawImage(template, 0, 0);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
