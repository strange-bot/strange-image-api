import express from "express";
import { Controller } from "../typings";

// middlewares
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import session from "express-session"

// custom middlewares
import errorMiddleware from "./middlewares/error.middleware";

export default class App {
    private app: express.Application;

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
        this.app.use(session({
            secret: process.env.SESSION_SECRET as string,
            cookie: { maxAge: 336 * 60 * 60 * 1000 },
            name: "strange_api_cookie",
            resave: false,
            saveUninitialized: false,
        }));
        this.app.use(
            helmet({
                contentSecurityPolicy: false, // swagger-ui
            })
        );
        this.app.use(
            "/api/",
            rateLimit({
                windowMs: 1000, // 1 second
                max: 5, // limit each IP to 5 requests per second
                statusCode: 429, // status code 429
                message: {
                    success: false,
                    code: 429,
                    message: "429 To Many Requests! Please try again later.",
                },
                standardHeaders: true,
                legacyHeaders: true,
                keyGenerator: (req, _res) =>
                    ((req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip) as string)
                        .split(",")[0]
                        .trim(),
            })
        );
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
        this.app.use("*", (_req, res) => {
            res.status(404).send({
                success: false,
                code: 404,
                message: "404 Not Found. Visit /docs for more information",
            });
        });
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
}
