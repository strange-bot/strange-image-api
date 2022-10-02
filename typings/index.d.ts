import { ApplicationCommandOptionData, ChatInputCommandInteraction } from "discord.js";

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
