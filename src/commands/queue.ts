import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/Command";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Gets the current queue"),

  async execute(client, interaction: ChatInputCommandInteraction<CacheType>) {
    const queue = client.musicPlayer.getQueue(interaction.guild!.id);

    await interaction.reply(queue.join("\n"));
  },
} as Command;
