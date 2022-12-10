import { ChatInputCommandInteraction, ApplicationCommandOptionData, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../../typings";
import User from "../../schemas/User";

export default class ApiKey implements Command {
    public name: string;
    public description: string;
    public ephemeral: boolean;
    public options: ApplicationCommandOptionData[];

    constructor() {
        this.name = "apikey";
        this.description = "apikey commands";
        this.ephemeral = true;
        this.options = [
            {
                name: "generate",
                description: "generate an API key",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "regenerate",
                description: "regenerate an API key",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "revoke",
                description: "delete an API key",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "show",
                description: "show your API key",
                type: ApplicationCommandOptionType.Subcommand,
            },
        ];
    }

    public async callback(interaction: ChatInputCommandInteraction) {
        if (process.env.AUTHENTICATION !== "1") return "API Authentication is disabled.";
        const sub = interaction.options.getSubcommand();
        const apiKey = User.getToken(interaction.user.id);

        // generate
        if (sub === "generate") {
            if (apiKey) {
                return "You already have an API key.\nType `/apikey regenerate` to regenerate it.";
            }
            const newApiKey = await User.createOrRegenerate(interaction.user.id, interaction.user.tag);
            await interaction.client.roleHandler.addRole(interaction.user.id);
            return "Your API key is ```" + newApiKey + "```";
        }

        // regenerate
        if (sub === "regenerate") {
            const newApiKey = await User.createOrRegenerate(interaction.user.id, interaction.user.tag);
            return "Your API key is ```" + newApiKey + "```";
        }

        // revoke
        if (sub === "revoke") {
            if (!apiKey) return "You don't have an API Key yet!";
            await User.deleteToken(interaction.user.id);
            return "Your API Key has been deleted!";
        }

        // show
        if (sub === "show") {
            if (!apiKey) return "You don't have an API Key yet!";
            return "Your API key is ```" + apiKey + "```";
        }

        return "Unknown subcommand";
    }
}
