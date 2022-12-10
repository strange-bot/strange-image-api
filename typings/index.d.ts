import { ApplicationCommandOptionData, ChatInputCommandInteraction } from "discord.js";
import RoleHandler from "../src/bot/helpers/roleHandler";

export interface Controller {
    path: string;
    router: Router;
}

export interface Command {
    name: string;
    description: string;
    ephemeral?: boolean;
    options?: ApplicationCommandOptionData[] | [];
    callback: (interaction: ChatInputCommandInteraction) => Promise<string>;
}

declare global {
    namespace Express {
        interface Request {
            /**
             * property is added to all requests with the limit, current,
             * and remaining number of requests and, if the store provides it, a resetTime Date object.
             * These may be used in your application code to take additional actions or inform the user of their status
             */
            rateLimit: rateLimit.RateLimitInfo;
        }
    }
}

declare module "discord.js" {
    interface Client {
        commands: Map<string, Command>;
        roleHandler: RoleHandler;
    }
}
