"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("skip")
        .setDescription("skip current song or songs")
        .addNumberOption((option) => option.setName("amount").setDescription("Amount of songs to skip.")),
    async execute(client, interaction) {
        const amountStr = interaction.options.getString("amount") ?? "0";
        const amount = parseInt(amountStr);
        const guildID = interaction.guild?.id;
        if (!guildID) {
            await interaction.reply("Couldn't find guild ID for request.");
            return;
        }
        let player = client.musicPlayer.lavaclient.players.get(guildID);
        if (!player) {
            await interaction.reply("No songs playing.");
            return;
        }
        const guild = client.guilds.cache.get(guildID);
        const member = guild?.members.cache.get(interaction.member.user.id);
        const voiceChannel = member?.voice.channel;
        if (!voiceChannel) {
            await interaction.reply("You must join a voice channel to skip a song.");
            return;
        }
        const track = player.trackData?.title;
        await player.stop();
        await interaction.reply(`Skipping: ${track}}`);
    },
};
