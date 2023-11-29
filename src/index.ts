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
import { buttonHandler } from "./utils/buttonHandler";
import { exec } from "child_process";

dotenv.config();
process.title = "vinyl";

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
    client.commands.forEach((command) => {
      const d = JSON.parse(JSON.stringify(command.data));
      if (process.env.NODE_ENV !== "production") {
        // hack to override readonly name
        d.name = "dev" + d.name;
      }
      commandData.push(d);
    });

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
  // exec("java -jar lavalink.jar", (error, stdout, stderr) => {
  //   console.log("stdout: " + stdout);
  //   console.log("stderr: " + stderr);
  //   if (error !== null) {
  //     console.log("exec error: " + error);
  //   }
  // });
  // wait for lavalink to start
  await new Promise((res) => setTimeout(() => res(null), 10000));
  await client.musicPlayer.lavaclient.connect(c.user.id);
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  if (interaction.isButton()) {
    await buttonHandler(client, interaction);
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (command) {
    await command.execute(client, interaction);
  }
});

client.on("messageCreate", async (message) => {
  // if controls on send button controls again
});

client.login(TOKEN);
