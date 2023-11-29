"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonHandler = void 0;
const havana_1 = require("../buttonCommand/havana");
const hideControls_1 = require("../buttonCommand/hideControls");
const cheeseTax_1 = require("../buttonCommand/cheeseTax");
var ButtonActions;
(function (ButtonActions) {
    ButtonActions["Havana"] = "havana";
    ButtonActions["KatieNoe"] = "katie-noe";
    ButtonActions["HideControls"] = "hide-controls";
})(ButtonActions || (ButtonActions = {}));
async function buttonHandler(client, interaction) {
    if (interaction.customId === "havana") {
        await (0, havana_1.havana)(client, interaction);
    }
    else if (interaction.customId === "hide-controls") {
        await (0, hideControls_1.hideControls)(client, interaction);
    }
    else if (interaction.customId === "cheese-tax") {
        await (0, cheeseTax_1.cheeseTax)(client, interaction);
    }
}
exports.buttonHandler = buttonHandler;
