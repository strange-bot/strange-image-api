import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.session.user) {
        return res.redirect(
            `https://discord.com/api/oauth2/authorize?client_id=${
                process.env.BOT_ID
            }&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(process.env.BASE_URL + "/callback")}`
        );
    }
    res.redirect("/dashboard");
};
