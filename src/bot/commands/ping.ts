import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../../typings";

export default class Ping implements Command {
    public name: string;
    public description: string;
    public ephemeral: boolean;

    constructor() {
        this.name = "ping";
        this.description = "Pong!";
        this.ephemeral = true;
    }

    public async callback(interaction: ChatInputCommandInteraction) {
        return `🏓 Pong! \`${interaction.client.ws.ping}ms\``;
    }
}
