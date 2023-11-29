"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideControls = void 0;
async function hideControls(client, interaction) {
    client.musicPlayer.setControls(interaction.guildId, false);
    const messages = await interaction.channel?.messages.fetch({ limit: 50 });
    messages?.forEach(async (message) => {
        if (message.author.id === client.user?.id &&
            message.content === "Controls") {
            await message.delete();
        }
    });
    await interaction.reply("Hiding controls.");
    await interaction.deleteReply();
}
exports.hideControls = hideControls;
