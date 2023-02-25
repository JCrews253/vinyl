import { Client, Collection } from "discord.js";
import fs from "fs";
import { Node } from "lavaclient";
import path from "path";
import { Command } from "src/Command";
import { MusicPlayer } from "./MusicPlayer";

export default class VinylClient extends Client {
  commands: Collection<string, Command>;
  musicPlayer: MusicPlayer;
  music: Node;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
    this.musicPlayer = new MusicPlayer();
    this.loadCommands();
    this.music = new Node({
      sendGatewayPayload: (id, payload) =>
        this.guilds.cache.get(id)?.shard?.send(payload),
      connection: {
        host: "0.0.0.0",
        password: "youshallnotpass",
        port: 2333,
      },
    });

    this.music.on("error", (err) => console.log({ err }));
    this.music.on("debug", (debug) => console.log({ debug }));
    this.music.on("connect", (connect) => console.log({ connect }));
  }

  loadCommands() {
    const commandsPath = path.join(__dirname, "../commands");
    console.log({ commandsPath });
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

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
