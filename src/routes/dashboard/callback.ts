import { Request, Response } from "express";
import fetch from "node-fetch";
import btoa from "btoa";
import util from "util";

const wait = util.promisify(setTimeout);

export default async (req: Request, res: Response): Promise<any> => {
    if (!req.query.code) return res.redirect("/");

    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("code", req.query.code as string);
    params.set("redirect_uri", `${process.env.BASE_URL}/callback`);

    // Fetch tokens to get user information
    const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: params.toString(),
        headers: {
            Authorization: `Basic ${btoa(`${process.env.BOT_ID}:${process.env.BOT_SECRET}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const tokens = (await response.json()) as any;

    if (tokens.error || !tokens.access_token) {
        console.log("Failed to login to dashboard", tokens);
        return res.redirect(`/login`);
    }

    let userData;
    while (!userData) {
        const response = await fetch("http://discord.com/api/users/@me", {
            method: "GET",
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const json = (await response.json()) as any;
        if (json.retry_after) await wait(json.retry_after);
        else userData = json;
    }

    // update session
    req.session.user = userData;

    // redirect to dashboard
    res.redirect("/dashboard");
};
