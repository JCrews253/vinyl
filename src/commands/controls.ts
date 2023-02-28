import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/Command";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("controls")
    .setDescription("Show music control panel"),

  async execute(client, interaction: ChatInputCommandInteraction<CacheType>) {
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
        "You must join a voice channel to open controls."
      );
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("havana-button")
        .setLabel("Havana")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("katie-noel")
        .setEmoji("🔥")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ components: [row] });
  },
} as Command;
