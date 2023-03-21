import { Request, Response } from "express";

export default async (_req: Request, res: Response): Promise<any> => {
    return res.render("index");
};
