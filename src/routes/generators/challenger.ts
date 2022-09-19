import { Request, Response } from "express";
import { createCanvas, loadImage, Image, Canvas } from "canvas";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";
import CanvasUtil from "../../utils/CanvasUtil";

/**
 * @swagger
 * /generators/challenger:
 *   get:
 *     summary: Draws an image over Super Smash Bros "Challenger Approaching" screen
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: A URL to an image
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: silhouetted
 *         description: Whether the image is should be silhouetted
 *         required: false
 *         schema:
 *           type: boolean
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

        if (!req.query.silhouetted) {
            req.query.silhouetted = "false";
        }
        const template = await loadImage(Util.loadAsset("generators/challenger.png"));
        const avatar = await loadImage(image as string);
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0);
        ctx.drawImage(req.query.silhouetted === "true" ? silhouetteImage(avatar) : avatar, 484, 98, 256, 256);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};

function silhouetteImage(image: Image): Canvas {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    CanvasUtil.silhouette(ctx, 0, 0, image.width, image.height);
    return canvas;
}
