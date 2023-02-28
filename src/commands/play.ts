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
      throw new Error("Expected to receive a request but was null.");
    }

    const guildID = interaction.guild?.id;
    if (!guildID) {
      await interaction.reply("Couldn't find guild ID for request.");
      return;
    }

    const guild = client.guilds.cache.get(guildID);
    const member = guild?.members.cache.get(interaction.member!.user.id);
    const voiceChannel = member?.voice.channel;
    if (!voiceChannel) {
      await interaction.reply(
        "You must join a voice channel to request a song."
      );
      return;
    }
    let player = client.musicPlayer.lavaclient.players.get(guildID);
    if (!player) {
      player = client.musicPlayer.lavaclient.createPlayer(guildID);
    }

    if (!player.connected) {
      await player.connect(voiceChannel.id);
    }

    if (player.playing && voiceChannel.id !== player.channelId) {
      await interaction.reply(
        "You must join the bot's current voice channel to request."
      );
      return;
    }

    const result = await client.musicPlayer.lavaclient.rest.loadTracks(
      /^https?:\/\//.test(request) ? request : `ytsearch:${request}`
    );
    const track = result.tracks[0];

    await player.play(track);

    await interaction.reply(
      `${interaction.user.username} requested: ${track.info.title}`
    );
  },
} as Command;
