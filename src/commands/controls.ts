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

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("havana")
        .setLabel("Havana")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cheese-tax")
        .setEmoji("🧀")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("hide-controls")
        .setLabel("Hide")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ content: "Controls", components: [row] });
    client.musicPlayer.setControls(interaction.guildId!, true);
  },
} as Command;
