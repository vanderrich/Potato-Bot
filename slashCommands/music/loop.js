"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("loop")
        .setDescription("Loop the track or queue")
        .addNumberOption(option => option
        .setName("loop")
        .setDescription("The object to loop")
        .setRequired(true)
        .addChoices({ name: "Off", value: 0 }, { name: "Track", value: 1 }, { name: "Queue", value: 2 }, { name: "Autoplay", value: 3 })),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        const loop = interaction.options.getNumber("loop");
        queue.setRepeatMode(loop);
        interaction.reply(`${loop === 0 ? "Off" : loop === 1 ? "Looping track 🔂" : loop === 2 ? "Looping queue 🔁" : "Autoplaying 🔂"}`);
    }
};
