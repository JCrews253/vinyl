import { ButtonInteraction, CacheType } from "discord.js";
import { havana } from "../buttonCommand/havana";
import { hideControls } from "../buttonCommand/hideControls";
import VinylClient from "src/client/VinylClient";
import { cheeseTax } from "../buttonCommand/cheeseTax";

enum ButtonActions {
  Havana = "havana",
  KatieNoe = "katie-noe",
  HideControls = "hide-controls",
}

export async function buttonHandler(
  client: VinylClient,
  interaction: ButtonInteraction<CacheType>
) {
  if (interaction.customId === "havana") {
    await havana(client, interaction);
  } else if (interaction.customId === "hide-controls") {
    await hideControls(client, interaction);
  } else if (interaction.customId === "cheese-tax") {
    await cheeseTax(client, interaction);
  }
}
