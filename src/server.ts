// load and validate environment variables
import "dotenv/config";
import validateEnv from "./utils/validateEnv";
validateEnv();

import App from "./app";
import DiscordBot from "./bot";

// controllers
import DashboardController from "./controllers/dashboard.controller";
import DocsController from "./controllers/docs.controller";
import DebugController from "./controllers/debug.controller";
import FilterController from "./controllers/filters.controller";
import GeneratorsController from "./controllers/generators.controller";
import OverlaysController from "./controllers/overlays.controller";
import UtilsController from "./controllers/utils.controller";
import User from "./schemas/User";
import Logger from "./utils/Logger";

const app = new App([
    new DashboardController("/"),
    new DocsController("/docs"),
    new DebugController("/api/debug"),
    new FilterController("/api/filters"),
    new GeneratorsController("/api/generators"),
    new OverlaysController("/api/overlays"),
    new UtilsController("/api/utils"),
]);

async function init() {
    if (process.env.AUTHENTICATION === "1") await User.init();
    if (process.env.DISCORD_TOKEN) await new DiscordBot().init();
    app.listen(process.env.PORT as string);
}

init();

// log uncaught exceptions
process.on("uncaughtException", (err) => {
    Logger.error("uncaughtException", err);
});

// log unhandled rejections
process.on("unhandledRejection", (err) => {
    Logger.error("unhandledRejection", err);
});
