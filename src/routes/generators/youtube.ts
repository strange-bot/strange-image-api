import { Canvas, resolveImage } from "canvas-constructor";
import { registerFont } from "canvas";
import Util from "../../utils/Util";
import { Request, Response } from "express";
import ResponseUtil from "../../utils/ResponseUtil";

registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Noto-CJK.otf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Noto-Emoji.ttf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Chivo-Bold.otf`, { family: "Chivo" });

/**
 * @swagger
 * /generators/youtube:
 *   get:
 *     summary: Sends a youtube comment with the text of your choice
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: image
 *         description: The username avatar
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: username
 *         description: The username as the comment author
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: text
 *         description: The text to be used in the returned image results
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
        const { image, username, text } = req.query;
        if (!image || !username || !text) return ResponseUtil.missingParams(res, "image", "username", "text");

        const base = Util.loadAsset("generators/youtube.png");
        const randomTime = Util.getRandomInt(1, 60);
        const canvas = new Canvas(650, 183)
            .printImage(await resolveImage(base), 0, 0, 650, 183)
            .printCircularImage(await resolveImage(image as string | Buffer), 46, 55, 27)
            .setTextFont("18px Chivo")
            .printText(username as string, 90, 45)
            .setTextFont("17px Noto")
            .printText(text as string, 90, 73)
            .setGlobalAlpha(0.6)
            .setTextFont("15px Noto")
            .measureText(username as string, function (size) {
                this.printText(`${randomTime} minutes ago`, size.width * 1.1 + 126, 45);
            });

        const buffer = canvas.toBuffer();
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
