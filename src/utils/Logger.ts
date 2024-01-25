import { logError } from "../bot/helpers/webHook";

export default class Logger {
    static info(message: string) {
        console.log(message);
    }

    static error(title: string, err: any) {
        console.error(err);

        // Webhook Logger
        if (process.env.WEBHOOK_URL) {
            logError(title, err);
        }

        // TODO: Database Logger
    }
}
