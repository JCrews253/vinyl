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

    await rest.put(Routes.applicationCommands("910263305900277791"), {
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
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    await command.execute(client, interaction);
  }
});

client.login(TOKEN);
