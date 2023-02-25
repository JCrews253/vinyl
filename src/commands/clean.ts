import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/Command";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clean")
    .setDescription("Clean chat of Vinyl messages"),

  async execute(client, interaction: ChatInputCommandInteraction<CacheType>) {
    const messages = await interaction.channel?.messages.fetch({ limit: 25 });
    messages?.forEach(async (message) => {
      if (message.author.id === client.user?.id) {
        await message.delete();
      }
    });
    await interaction.reply("deleting...");
    await interaction.deleteReply();
  },
} as Command;
