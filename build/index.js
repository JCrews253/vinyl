"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const VinylClient_1 = __importDefault(require("./client/VinylClient"));
const dotenv = __importStar(require("dotenv"));
const buttonHandler_1 = require("./utils/buttonHandler");
dotenv.config();
process.title = "vinyl";
const TOKEN = process.env.TOKEN;
if (!TOKEN) {
    throw new Error("Expected token but process.env.TOKEN was undefined");
}
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
if (!DISCORD_APPLICATION_ID) {
    throw new Error("Expected DISCORD_APPLICATION_ID but process.env.DISCORD_APPLICATION_ID was undefined");
}
const client = new VinylClient_1.default({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
});
const rest = new discord_js_1.REST({ version: "10" }).setToken(TOKEN);
(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        const commandData = [];
        client.commands.forEach((command) => {
            const d = JSON.parse(JSON.stringify(command.data));
            if (process.env.NODE_ENV !== "production") {
                d.name = "dev" + d.name;
            }
            commandData.push(d);
        });
        await rest.put(discord_js_1.Routes.applicationCommands(DISCORD_APPLICATION_ID), {
            body: commandData,
        });
        console.log("Successfully reloaded application (/) commands.");
    }
    catch (error) {
        console.error(error);
    }
})();
client.once(discord_js_1.Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    await new Promise((res) => setTimeout(() => res(null), 10000));
    await client.musicPlayer.lavaclient.connect(c.user.id);
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isButton())
        return;
    if (interaction.isButton()) {
        await (0, buttonHandler_1.buttonHandler)(client, interaction);
        return;
    }
    const command = client.commands.get(interaction.commandName);
    if (command) {
        await command.execute(client, interaction);
    }
});
client.on("messageCreate", async (message) => {
});
client.login(TOKEN);
