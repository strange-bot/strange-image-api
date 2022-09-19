import { Request, Response } from "express";
import { Batslap } from "discord-image-generation";
import ResponseUtil from "../../utils/ResponseUtil";

/**
 * @swagger
 * /generators/batslap:
 *   get:
 *     summary: Generates a batslap image
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: image1
 *         description: The image 1 url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: image2
 *         description: The image 2 url
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
        const { image1, image2 } = req.query;
        if (!image1 || !image2) return ResponseUtil.missingParams(res, "image1", "image2");
        const buffer = await new Batslap().getImage(image1 as string, image2 as string);
        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
