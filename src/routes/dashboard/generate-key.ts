import { Request, Response } from "express";
import User from "../../schemas/User";

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.session.user) {
        return res.redirect(`/login`);
    }

    let reGen = false;
    let apiKey = User.getToken(req.session.user.id);

    if (!apiKey) reGen = true;
    apiKey = await User.createOrRegenerate(
        req.session.user.id,
        req.session.user.username + "#" + req.session.user.discriminator,
        "Dashboard"
    );

    return res.json({
        status: reGen ? "regenerated" : "created",
        apiKey,
    });
};
