import { Request, Response } from "express";
import { Rank } from "canvacord";
import ResponseUtil from "../../utils/ResponseUtil";

type status = "dnd" | "idle" | "offline" | "online" | "streaming";

/**
 * @swagger
 * /utils/rank-card:
 *   get:
 *     summary: Generates a rank card
 *     tags: [Utils]
 *     parameters:
 *       - in: query
 *         name: avatar
 *         description: Avatar data
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: currentxp
 *         description: Current XP
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: reqxp
 *         description: Required XP
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: level
 *         description: Current level
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: rank
 *         description: Current rank
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         description: User status
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         description: Username
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: discriminator
 *         description: User discriminator
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: barcolor
 *         description: Progress Bar Color
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: bgImage
 *         description: Background Image
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: bgColor
 *         description: Background Color
 *         required: false
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
        const avatar = req.query.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
        const currentxp = parseInt(req.query.currentxp as string) || 0;
        const reqXp = parseInt(req.query.reqxp as string) || 100;
        const level = parseInt(req.query.level as string) || 1;
        const rank = parseInt(req.query.rank as string);
        const status = req.query.status || "idle"; // dnd || idle || offline || online || streaming
        const name = req.query.name || "Discord User";
        const discriminator = req.query.discriminator || "0000";
        const barcolor = req.query.barcolor || "#FFFFFF";

        // validate number inputs
        if (isNaN(currentxp)) return ResponseUtil.badRequest(res, "currentxp must be a number");
        if (isNaN(reqXp)) return ResponseUtil.badRequest(res, "reqxp must be a number");
        if (isNaN(level)) return ResponseUtil.badRequest(res, "level must be a number");
        if (isNaN(rank)) return ResponseUtil.badRequest(res, "rank must be a number");

        // check status
        if (!["dnd", "idle", "offline", "online", "streaming"].includes(status as string)) {
            return ResponseUtil.badRequest(res, "status must be dnd, idle, offline, online or streaming");
        }

        const bgImage = req.query.bgImage;
        const bgColor = req.query.bgColor;

        const card = new Rank()
            .setAvatar(avatar as string)
            .setCurrentXP(currentxp)
            .setRequiredXP(reqXp)
            .setLevel(level)
            .setStatus(status as status)
            .setProgressBar(barcolor as string, "COLOR")
            .setUsername(name as string)
            .setDiscriminator(discriminator as string);

        if (bgImage) card.setBackground("IMAGE", bgImage as string);
        if (bgColor) card.setBackground("COLOR", bgColor as string);

        // Rank
        if (!isNaN(rank)) card.setRank(rank);
        else card.setRank(1, "Rank", false);

        const buffer = await card.build();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
