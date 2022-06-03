"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("stop")
        .setDescription("Destroy the queue."),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue || !queue.playing)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        queue.destroy();
        interaction.reply(`The music playing on this server has been turned off, see you next time ✅`);
    },
};
