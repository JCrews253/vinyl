"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MusicPlayer_1 = require("./MusicPlayer");
class VinylClient extends discord_js_1.Client {
    commands;
    musicPlayer;
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.loadCommands();
        this.musicPlayer = new MusicPlayer_1.MusicPlayer(this.guilds);
        this.ws.on(discord_js_1.GatewayDispatchEvents.VoiceServerUpdate, async (data) => {
            await this.musicPlayer.lavaclient.handleVoiceUpdate(data);
        });
        this.ws.on(discord_js_1.GatewayDispatchEvents.VoiceStateUpdate, async (data) => {
            await this.musicPlayer.lavaclient.handleVoiceUpdate(data);
        });
    }
    loadCommands() {
        const commandsPath = path_1.default.join(__dirname, "../commands");
        console.log({ commandsPath });
        const commandFiles = fs_1.default
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
        console.log({ commandFiles });
        for (const file of commandFiles) {
            const filePath = path_1.default.join(commandsPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                if (process.env.NODE_ENV === "production") {
                    this.commands.set(command.data.name, command);
                }
                else {
                    this.commands.set("dev" + command.data.name, command);
                }
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}
exports.default = VinylClient;
