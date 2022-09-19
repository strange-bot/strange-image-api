import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import CanvasUtil from "../../utils/CanvasUtil";
import ResponseUtil from "../../utils/ResponseUtil";

/**
 * @swagger
 * /generators/demotivational:
 *   get:
 *     summary: Draws an image and the text you specify as a demotivational poster
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: title
 *         description: The title for poster
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: text
 *         description: The text as the poster description
 *         required: true
 *         schema:
 *           type: string
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
        const { title, text, image } = req.query;
        if (!title || !text || !image) {
            return ResponseUtil.missingParams(res, "title", "text", "image");
        }

        const data = await loadImage(image as string);
        const canvas = createCanvas(750, 600);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let { width, height } = data;
        const maxWidth = 602;
        if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height *= ratio;
        }
        const maxHeight = 402;
        if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width *= ratio;
        }
        const x = canvas.width / 2 - width / 2;
        const y = 44 + (402 / 2 - height / 2);
        ctx.fillStyle = "white";
        ctx.fillRect(x - 4, y - 4, width + 8, height + 8);
        ctx.fillStyle = "black";
        ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, width, height);
        ctx.drawImage(data, x, y, width, height);
        ctx.textAlign = "center";
        ctx.font = "60px Noto";
        ctx.fillStyle = "aquamarine";
        ctx.fillText(CanvasUtil.shortenText(ctx, title as string, 610), 375, 518);
        ctx.font = "27px Noto";
        ctx.fillStyle = "white";
        ctx.fillText(CanvasUtil.shortenText(ctx, text as string, 610), 375, 565);
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
