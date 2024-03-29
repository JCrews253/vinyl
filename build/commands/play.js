"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Request a song to play")
        .addStringOption((option) => option.setName("request").setDescription("song to play").setRequired(true)),
    async execute(client, interaction) {
        const request = interaction.options.getString("request");
        if (!request) {
            throw new Error("Expected to receive a request but was null.");
        }
        const guildID = interaction.guild?.id;
        if (!guildID) {
            await interaction.reply("Couldn't find guild ID for request.");
            return;
        }
        const guild = client.guilds.cache.get(guildID);
        const member = guild?.members.cache.get(interaction.member.user.id);
        const voiceChannel = member?.voice.channel;
        if (!voiceChannel) {
            await interaction.reply("You must join a voice channel to request a song.");
            return;
        }
        const response = await client.musicPlayer.play(request, guildID, voiceChannel.id);
        await interaction.reply(response);
    },
};
