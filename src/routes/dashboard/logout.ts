import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.redirect("/");
};
