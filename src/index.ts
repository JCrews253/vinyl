import {
  CacheType,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
} from "discord.js";
import VinylClient from "./client/VinylClient";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  throw new Error("Expected token but process.env.TOKEN was undefined");
}

const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
if (!DISCORD_APPLICATION_ID) {
  throw new Error(
    "Expected DISCORD_APPLICATION_ID but process.env.DISCORD_APPLICATION_ID was undefined"
  );
}

const client = new VinylClient({
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildMembers, // for guild members related things
    GatewayIntentBits.GuildIntegrations, // for discord Integrations
    GatewayIntentBits.GuildVoiceStates, // for voice related things
  ],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    const commandData: any = [];
    client.commands.forEach((command) =>
      commandData.push(command.data.toJSON())
    );

    await rest.put(Routes.applicationCommands(DISCORD_APPLICATION_ID), {
      body: commandData,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  await client.musicPlayer.lavaclient.connect(c.user.id);
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  if (interaction.isButton()) {
    if (interaction.customId === "havana-button") {
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
    } else if (interaction.customId === "katie-noel") {
      const guild = client.guilds.cache.get(interaction.guildId ?? "");
      const member = guild?.members.cache.get(interaction.member!.user.id);
      const voiceChannel = member?.voice.channel;
      await client.musicPlayer.play(
        "https://www.youtube.com/watch?v=rLe_yn7Uq14",
        guild?.id ?? "",
        voiceChannel?.id ?? ""
      );
      await interaction.reply(
        "https://www.youtube.com/watch?v=rLe_yn7Uq14 added to queue."
      );
      await interaction.deleteReply();
    }
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (command) {
    await command.execute(client, interaction);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // if controls on send button controls again
});

client.login(TOKEN);
