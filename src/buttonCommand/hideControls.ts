import { ButtonInteraction, CacheType } from "discord.js";
import VinylClient from "src/client/VinylClient";

export async function hideControls(
  client: VinylClient,
  interaction: ButtonInteraction<CacheType>
) {
  client.musicPlayer.setControls(interaction.guildId!, false);
  const messages = await interaction.channel?.messages.fetch({ limit: 50 });
  messages?.forEach(async (message) => {
    if (
      message.author.id === client.user?.id &&
      message.content === "Controls"
    ) {
      await message.delete();
    }
  });

  await interaction.reply("Hiding controls.");
  await interaction.deleteReply();
}
