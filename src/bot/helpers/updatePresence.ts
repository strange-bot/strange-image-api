import { ActivityType, Client } from "discord.js";
import User from "../../schemas/User";

export default (client: Client) => {
    const update = () => {
        const activity = process.env.AUTHENTICATION === "1" ? `requests from ${User.getCacheSize()} users` : "api requests";
        client.user?.setPresence({
            afk: false,
            status: "online",
            activities: [
                {
                    name: activity,
                    type: ActivityType.Watching,
                },
            ],
        });
    };

    update();
    setInterval(update, 1000 * 60 * 15);
};
