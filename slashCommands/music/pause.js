"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("pause")
        .setDescription("Pause the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue || !queue.playing)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        const success = queue.setPaused(true);
        return interaction.reply(success ? `The currently playing music named **${queue.current.title}** has stopped ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};
