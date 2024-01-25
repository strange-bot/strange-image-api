import BotClient from "..";
import User from "../../schemas/User";
import Logger from "../../utils/Logger";

export default class RoleHandler {
    private client: BotClient;

    constructor(client: BotClient) {
        this.client = client;
        this.client.once("ready", () => this.init());
        this.client.on("guildMemberAdd", (member) => {
            if (member.user.bot) return;
            User.getAllUsers().find((u) => u.discord_id === member.id) && this.addRole(member.id);
        });
    }

    private async init() {
        if (!process.env.DISCORD_SERVER_ID || !process.env.DISCORD_ROLE_ID) return;
        const guild = this.client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
        if (!guild) return;
        const role = guild.roles.cache.find((r) => r.id === process.env.DISCORD_ROLE_ID);
        if (!role) return;

        // Add roles to existing users
        const apiUsers = User.getAllUsers();
        let count = 0;
        for (const user of apiUsers) {
            const member = await guild.members.fetch(user.discord_id).catch(() => null);
            if (!member) continue;
            if (member.roles.cache.has(role.id)) continue;
            await member.roles.add(role);
            count++;
        }
        Logger.info(`[RoleHandler] - Added role to ${count} users`);
    }

    public async addRole(userId: string) {
        if (!process.env.DISCORD_SERVER_ID || !process.env.DISCORD_ROLE_ID) return;
        const guild = this.client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
        if (!guild) return;
        const role = guild.roles.cache.find((r) => r.id === process.env.DISCORD_ROLE_ID);
        if (!role) return;

        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return;
        if (member.roles.cache.has(role.id)) return;
        await member.roles.add(role);

        Logger.info(`[RoleHandler] - Added role to ${member.user.tag}`);
    }
}
