import { Client, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../../typings";
import RoleHandler from "./helpers/roleHandler";
import updatePresence from "./helpers/updatePresence";

export default class BotClient extends Client {
    public commands: Map<string, Command>;
    public roleHandler: RoleHandler;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
        });
        this.commands = new Map();
        this.roleHandler = new RoleHandler(this);
    }

    public async init() {
        this.loadEvents();
        this.loadCommands();
        await this.login(process.env.DISCORD_TOKEN);
    }

    private loadEvents() {
        this.on("ready", async () => {
            if (this.user) {
                console.log(`Logged in as ${this.user.tag}!`);
                await this.registerCommands();
                updatePresence(this);
            }
        });

        this.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            const command = this.commands.get(interaction.commandName);
            if (!command) return;
            try {
                const reply = await command.callback(interaction);
                await interaction.reply({ content: reply, ephemeral: command.ephemeral || false });
            } catch (error: any) {
                console.log(error);
                await interaction.reply("There was an error while executing this command!");
            }
        });
    }

    private loadCommands() {
        const commandFiles = readdirSync(join(__dirname, "commands")).filter(
            (file) => file.endsWith(".ts") || file.endsWith(".js"),
        );
        for (const file of commandFiles) {
            let CmdClass = require(`./commands/${file}`);
            if (CmdClass.default) CmdClass = CmdClass.default;
            const command = new CmdClass() as Command;
            this.commands.set(command.name, command);
        }
        console.log(`Loaded ${this.commands.size} commands!`);
    }

    private async registerCommands() {
        const toRegister = [];
        for (const command of this.commands.values()) {
            toRegister.push({
                name: command.name,
                description: command.description,
                ephemeral: command.ephemeral || false,
                options: command.options || [],
            });
        }

        if (process.env.DISCORD_SERVER_ID) {
            const guild = this.guilds.cache.get(process.env.DISCORD_SERVER_ID);
            if (guild) await guild.commands.set(toRegister);
            else console.log("Guild not found!");
        } else {
            await this.application?.commands.set(toRegister);
        }

        console.log(`Registered ${this.commands.size} commands!`);
    }
}
