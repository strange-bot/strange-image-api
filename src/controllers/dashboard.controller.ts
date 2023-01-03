import express from "express";
import { Controller } from "../../typings";
import { join } from "path";
import { readdirSync } from "fs";

export default class DashboardController implements Controller {
    public path: string;
    public router: express.Router;

    public constructor(path: string) {
        this.path = path;
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const routesDir = readdirSync(join(__dirname + "/../routes/dashboard"));
        for (const endpoint of routesDir) {
            let file = require(`../routes/dashboard/${endpoint}`);
            if (file.default) file = file.default;
            if (endpoint.includes("index")) {
                this.router.get(this.path, file);
            } else {
                this.router.get(`${this.path}/${endpoint.split(".")[0]}`, file);
            }
        }
    }
}
