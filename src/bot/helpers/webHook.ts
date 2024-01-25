import { EmbedBuilder, WebhookClient } from "discord.js";

const webhookLogger = process.env.WEBHOOK_URL
    ? new WebhookClient({
          url: process.env.WEBHOOK_URL,
      })
    : null;

export function logError(title: string, err: any) {
    if (!webhookLogger) return;
    const embed = new EmbedBuilder().setAuthor({ name: title }).setColor("#ff0000");

    if (err?.stack) embed.setDescription("```" + err.stack.slice(0, 4000) + "```");

    embed.addFields([
        {
            name: "Name",
            value: err.name || "N/A",
        },
        {
            name: "Error",
            value: err.message || "N/A",
        },
    ]);

    webhookLogger.send({
        username: "Error",
        embeds: [embed],
    });
}

export function log(title: string, message: string) {
    if (!webhookLogger) return;
    const embed = new EmbedBuilder().setAuthor({ name: title }).setDescription(message);
    webhookLogger
        .send({
            username: "Logger",
            embeds: [embed],
        })
        .catch((err) => console.error(err));
}
