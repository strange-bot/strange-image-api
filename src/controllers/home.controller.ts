import express from "express";
import { Controller } from "../../typings";

export default class HomeController implements Controller {
    public path: string;
    public router: express.Router;

    public constructor(path: string) {
        this.path = path;
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use("/", express.static("public"));
        this.router.get("/discord", (_req, res) => {
            res.redirect("https://discord.gg/jAQg6xs8vu");
        });
    }
}
