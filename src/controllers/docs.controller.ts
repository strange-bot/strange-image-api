import { Router } from "express";
import { Controller } from "../../typings";
import swaggerDocument from "../../swagger.json";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default class DocsController implements Controller {
    public path: string;
    public router: Router;

    public constructor(path: string) {
        this.path = path;
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const swaggerSpec = swaggerJsdoc({
            definition: swaggerDocument,
            apis: ["src/routes/**/*.js", "src/routes/**/*.ts"],
        });

        this.router.get(`${this.path}.json`, (_req, res) => {
            return res.json(swaggerSpec);
        });

        this.router.use(this.path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
}
