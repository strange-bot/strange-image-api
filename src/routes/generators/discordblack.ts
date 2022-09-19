import { Request, Response } from "express";
import { DiscordBlack } from "discord-image-generation";
import ResponseUtil from "../../utils/ResponseUtil";

/**
 * @swagger
 * /generators/discordblack:
 *   get:
 *     summary: Generates a Discord black overlay
 *     tags: [Generators]
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
        const buffer = await new DiscordBlack().getImage(image as string);
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
