import {
  Application,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import config from "config";

import VinylClient from "./utils/VinylClient";

const token = config.get<string>("token");

const client = new VinylClient({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  {
    name: "play",
    description: "Replies with Pong!",
  },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("773721125871812622"), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(".")) {
    await message.reply("testing");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    await command.execute(interaction);
  }
});

client.login(token);
