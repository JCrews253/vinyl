"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("queue")
        .setDescription("Gets the current queue"),
    async execute(client, interaction) {
        const queue = client.musicPlayer.getQueue(interaction.guild.id);
        await interaction.reply(queue.join("\n"));
    },
};
