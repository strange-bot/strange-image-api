import config from "../config";
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

app.listen(config.PORT);
