"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("clean")
        .setDescription("Clean chat of Vinyl messages"),
    async execute(client, interaction) {
        const messages = await interaction.channel?.messages.fetch({ limit: 25 });
        await interaction.reply("deleting...");
        messages?.forEach(async (message) => {
            if (message.author.id === client.user?.id) {
                await message.delete();
            }
        });
        await interaction.deleteReply();
    },
};
