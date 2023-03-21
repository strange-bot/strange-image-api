import { Request, Response } from "express";
import User from "../../schemas/User";

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.session.user) {
        return res.redirect(`/login`);
    }
    const apiKey = User.getToken(req.session.user.id);
    return res.render("dashboard", {
        username: req.session.user.username + "#" + req.session.user.discriminator,
        avatar: `https://cdn.discordapp.com/avatars/${req.session.user.id}/${req.session.user.avatar}.webp?size=256`,
        apiKey,
        hidden: apiKey ? apiKey.replace(/./g, "*") : null,
    });
};
