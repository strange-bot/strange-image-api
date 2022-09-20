import { cleanEnv, port, bool } from "envalid";

export default function validateEnv(): void {
    cleanEnv(process.env, {
        PORT: port(),
        LOGGING: bool(),
        AUTHENTICATION: bool(),
    });
}
