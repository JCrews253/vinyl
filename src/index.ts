import {
  CacheType,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
} from "discord.js";
import VinylClient from "./utils/VinylClient";
import * as dotenv from "dotenv";

dotenv.config();
// dotenv.config({ path: `.env.local`, override: true });

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  throw new Error("Expected token but process.env.TOKEN was undefined");
}

const client = new VinylClient({
  intents: [GatewayIntentBits.Guilds],
});

// const rest = new REST({ version: "10" }).setToken(TOKEN);

// (async () => {
//   try {
//     console.log("Started refreshing application (/) commands.");

//     const commandData: any = [];
//     client.commands.forEach((command) =>
//       commandData.push(command.data.toJSON())
//     );

//     await rest.put(Routes.applicationCommands("773721125871812622"), {
//       body: commandData,
//     });

//     console.log("Successfully reloaded application (/) commands.");
//   } catch (error) {
//     console.error(error);
//   }
// })();

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  await client.musicPlayer.startManager(c.user.id);
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    await command.execute(client, interaction);
  }
});

client.login(TOKEN);
