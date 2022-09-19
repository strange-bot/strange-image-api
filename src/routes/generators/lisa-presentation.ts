import { Request, Response } from "express";
import { createCanvas, loadImage, registerFont } from "canvas";
import CanvasUtil from "../../utils/CanvasUtil";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Noto-CJK.otf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Noto-Emoji.ttf`, { family: "Noto" });

/**
 * @swagger
 * /generators/lisa-presentation:
 *   get:
 *     summary: Sends a "Lisa Presentation" meme with the presentation of your choice
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: text
 *         description: A text for the meme
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
        const { text } = req.query;
        if (!text) return ResponseUtil.missingParams(res, "text");

        const template = await loadImage(Util.loadAsset("generators/lisa-presentation.png"));
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0);
        ctx.textAlign = "center";
        ctx.font = "40px Noto";
        let fontSize = 40;
        while (ctx.measureText(text as string).width > 1320) {
            fontSize -= 1;
            ctx.font = `${fontSize}px Noto`;
        }
        const lines = await CanvasUtil.wrapText(ctx, text as string, 330);
        for (let i = 0; i < lines!.length; i++) {
            const textHeight = 95 + i * fontSize + i * 10;
            ctx.fillText(lines![i], template.width / 2, textHeight);
        }
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
