// load and validate environment variables
import "dotenv/config";
import validateEnv from "./utils/validateEnv";
validateEnv();

import App from "./app";

// controllers
import DocsController from "./controllers/docs.controller";
import FilterController from "./controllers/filters.controller";
import GeneratorsController from "./controllers/generators.controller";
import OverlaysController from "./controllers/overlays.controller";

const app = new App([
    new DocsController("/docs"),
    new FilterController("/api/filters"),
    new GeneratorsController("/api/generators"),
    new OverlaysController("/api/overlays"),
]);

app.listen(process.env.PORT as string);
