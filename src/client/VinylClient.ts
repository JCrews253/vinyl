import { Client, Collection, GatewayDispatchEvents } from "discord.js";
import fs from "fs";
import { Node } from "lavaclient";
import path from "path";
import { Command } from "src/Command";
import { MusicPlayer } from "./MusicPlayer";

export default class VinylClient extends Client {
  commands: Collection<string, Command>;
  musicPlayer: MusicPlayer;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
    this.loadCommands();
    this.musicPlayer = new MusicPlayer(this.guilds);

    this.ws.on(GatewayDispatchEvents.VoiceServerUpdate, async (data) => {
      await this.musicPlayer.lavaclient.handleVoiceUpdate(data);
    });
    this.ws.on(GatewayDispatchEvents.VoiceStateUpdate, async (data) => {
      await this.musicPlayer.lavaclient.handleVoiceUpdate(data);
    });
  }

  loadCommands() {
    const commandsPath = path.join(__dirname, "../commands");
    console.log({ commandsPath });
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    console.log({ commandFiles });

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}
