"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const maxVol = 150;
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("volume")
        .setDescription("Change the volume of the current track.")
        .addIntegerOption(option => option
        .setName("vol")
        .setDescription("The volume to set the track to.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue || !queue.playing)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        const vol = interaction.options.getInteger("vol");
        if (!vol)
            return interaction.reply(`Current volume: **${queue.volume}** 🔊\n**To change the volume, with \`1\` to \`${maxVol}\` Type a number between.**`);
        if (queue.volume === vol)
            return interaction.reply(`${interaction.user}, The volume you want to change is already the current volume ❌`);
        if (vol < 0 || vol > maxVol)
            return interaction.reply(`${interaction.user}, **Type a number from \`1\` to \`${maxVol}\` to change the volume .** ❌`);
        const success = queue.setVolume(vol);
        return interaction.reply(success ? `Volume changed: **%${vol}**/**${maxVol}** 🔊` : `${interaction.user}, Something went wrong. ❌`);
    },
};
