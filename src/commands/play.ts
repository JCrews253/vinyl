import { Interaction, SlashCommandBuilder } from "discord.js";
import { Command } from "src/Command";
import VinylClient from "src/utils/VinylClient";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Request a song to play"),
  async execute(interaction: any) {
    await interaction.reply("Pong2!");
  },
} as Command;
