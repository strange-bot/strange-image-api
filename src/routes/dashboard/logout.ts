import { Request, Response } from "express";
import Logger from "../../utils/Logger";

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    req.session.destroy((err) => {
        if (err) {
            Logger.error("Failed to destroy session", err);
        }
    });
    res.redirect("/");
};
