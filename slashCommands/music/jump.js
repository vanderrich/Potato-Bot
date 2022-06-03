"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("jumptoindex")
        .setDescription("Jump to a specific track in the queue.")
        .addIntegerOption(option => option
        .setName("index")
        .setDescription("The index of the track to skip to.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue || !queue.playing)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        let index = interaction.options.getInteger('index');
        if (!index)
            return interaction.reply(`${interaction.user}, You must specify an index. ❌`);
        if (index < 0)
            interaction.reply("Index cant be a negative number! ❌");
        index--;
        queue.jump(index);
        return interaction.reply(`Skipped tracks ✅`);
    },
};
