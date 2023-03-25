import { Router } from "express";
import { join } from "path";
import { readdirSync } from "fs";
import { Controller } from "../../typings";
import authMiddleware from "../middlewares/auth.middleware";
import loggerMiddleware from "../middlewares/logger.middleware";

export default class OverlaysController implements Controller {
    public path: string;
    public router: Router;

    public constructor(path: string) {
        this.path = path;
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const routesDir = readdirSync(join(__dirname + "/../routes/overlays"));
        for (const endpoint of routesDir) {
            let file = require(`../routes/overlays/${endpoint}`);
            if (file.default) file = file.default;
            this.router.get(`${this.path}/${endpoint.split(".")[0]}`, authMiddleware, loggerMiddleware, file);
        }
    }
}
