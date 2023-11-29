"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.havana = void 0;
async function havana(client, interaction) {
    const guild = client.guilds.cache.get(interaction.guildId ?? "");
    const member = guild?.members.cache.get(interaction.member.user.id);
    const voiceChannel = member?.voice.channel;
    await client.musicPlayer.play("https://www.youtube.com/watch?v=HCjNJDNzw8Y", guild?.id ?? "", voiceChannel?.id ?? "");
    await interaction.reply("Havana added to queue.");
    await interaction.deleteReply();
}
exports.havana = havana;
