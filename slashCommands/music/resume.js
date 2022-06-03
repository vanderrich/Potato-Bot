"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("resume")
        .setDescription("Resume the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        const success = queue.setPaused(false);
        return interaction.reply(success ? `**${queue.current.title}**, The track continues to play. ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};
