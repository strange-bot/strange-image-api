import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.session.user) {
        return res.redirect(`/dashboard/login`);
    }

    return res.json({
        message: "success"
    })
};
