import express from "express";
import { Controller } from "../typings";

// middlewares
import helmet from "helmet";
import cors from "cors";

export default class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }

    public getServer(): express.Application {
        return this.app;
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
}
