"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("seek")
        .setDescription("Seek to a specific time in the current track")
        .addIntegerOption(option => option
        .setName("pos")
        .setDescription("The position to seek to.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue || !queue.playing)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        let pos = interaction.options.getInteger('pos');
        const success = queue.seek(pos);
        return interaction.reply(success ? `Seeked to ${pos} ✅` : `${interaction.user}, Something went wrong ❌`);
    },
};
