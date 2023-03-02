import { ButtonInteraction, CacheType } from "discord.js";
import VinylClient from "src/client/VinylClient";

export async function havana(
  client: VinylClient,
  interaction: ButtonInteraction<CacheType>
) {
  const guild = client.guilds.cache.get(interaction.guildId ?? "");
  const member = guild?.members.cache.get(interaction.member!.user.id);
  const voiceChannel = member?.voice.channel;
  await client.musicPlayer.play(
    "https://www.youtube.com/watch?v=HCjNJDNzw8Y",
    guild?.id ?? "",
    voiceChannel?.id ?? ""
  );
  await interaction.reply("Havana added to queue.");
  await interaction.deleteReply();
}
