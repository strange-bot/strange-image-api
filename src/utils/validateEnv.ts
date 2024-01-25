import Logger from "./Logger";

export default function validateEnv(): void {
    if (!process.env.PORT) throw new Error("PORT is not defined");
    else {
        if (isNaN(parseInt(process.env.PORT))) {
            throw new Error("PORT is not a number");
        }
    }

    if (process.env.AUTHENTICATION) {
        const auth = parseInt(process.env.AUTHENTICATION);
        if (![0, 1].includes(auth)) {
            throw new Error("AUTHENTICATION must be 0 or 1");
        }

        if (auth === 1) {
            if (!process.env.MONGO_URL) {
                throw new Error("MONGO_URL is not defined");
            }
        }
    }

    Logger.info("Environment variables validated.");
}
