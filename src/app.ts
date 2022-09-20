import express from "express";
import { Controller } from "../typings";

// middlewares
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// custom middlewares
import errorMiddleware from "./middlewares/error.middleware";
import logMiddleware from "./middlewares/log.middleware";

export default class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen(port: string): void {
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
        this.app.use(
            "/api/",
            rateLimit({
                windowMs: 5000, // 5 seconds
                max: 5, // limit each IP to 5 requests per second
                statusCode: 429, // status code 429
                message: {
                    success: false,
                    code: 429,
                    message: "429 To Many Requests! Please try again later.",
                },
                standardHeaders: true,
                legacyHeaders: true,
            })
        );
        if (Boolean(process.env.LOGGING)) this.app.use(logMiddleware);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
}
