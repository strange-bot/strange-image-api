import { Request, Response } from "express";
import { Leaver } from "canvacord";
import ResponseUtil from "../../utils/ResponseUtil";

/**
 * @swagger
 * /utils/farewell-card:
 *   get:
 *     summary: Generates a farewell card
 *     tags: [Utils]
 *     parameters:
 *       - in: query
 *         name: avatar
 *         description: Avatar image
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         description: Discord Username
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: discriminator
 *         description: Discord Discriminator
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: count
 *         description: Guild Member Count
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: guild
 *         description: Guild Name
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: bkg
 *         description: Background image
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
        const name = req.query.name || "Discord User";
        const discriminator = req.query.discriminator || "xxxx";
        const count = req.query.count || 0;
        const guild = req.query.guild || "Discord Server";

        if (isNaN(Number(count))) return ResponseUtil.badRequest(res, "count must be a number");

        // Background
        const bkg = req.query.bkg;

        // Text
        const message = req.query.message || "Leaving from {server}";
        const member_count = req.query.member_count || "- {count}th member";

        const image = new Leaver()
            .setUsername(name as string)
            .setDiscriminator(discriminator as string)
            .setMemberCount(Number(count))
            .setGuildName(guild as string)
            .setAvatar(avatar as string)
            .setText("title", "Goodbye")
            .setText("message", message as string)
            .setText("member-count", member_count as string)
            .setColor("border", "#4D5E94")
            .setColor("username-box", "#4D5E94")
            .setColor("discriminator-box", "#4D5E94")
            .setColor("message-box", "#4D5E94")
            .setColor("title", "#4D5E94")
            .setColor("avatar", "#4D5E94");

        if (bkg) image.setBackground(bkg as string);
        const buffer = await image.build();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
