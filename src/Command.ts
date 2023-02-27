import { CacheType, Interaction, SlashCommandBuilder } from "discord.js";
import VinylClient from "./client/VinylClient";

export interface Command {
  data: SlashCommandBuilder;
  execute: (
    client: VinylClient,
    interaction: Interaction<CacheType>
  ) => Promise<void>;
}
