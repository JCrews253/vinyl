import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/Command";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Request a song to play")
    .addStringOption((option) =>
      option.setName("request").setDescription("song to play").setRequired(true)
    ),

  async execute(client, interaction: ChatInputCommandInteraction<CacheType>) {
    const request = interaction.options.getString("request");
    if (!request) {
      throw new Error("Expected to receive a request but was null");
    }

    const player = client.music.players.get(interaction.guild!.id);
    console.log({ player });
    const guild = client.guilds.cache.get(interaction.guild!.id);
    const member = guild!.members.cache.get(interaction.member!.user.id);
    const voiceChannel = member!.voice.channel;
    player?.connect(voiceChannel!.id);
    await client.musicPlayer.play(interaction.guild!.id, request);

    await interaction.reply(
      `${interaction.user.username} requested: ${request}`
    );
  },
} as Command;
