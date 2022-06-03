"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("nowplaying")
        .setDescription("See the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client, footers) {
        var _a;
        const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
        if (!queue || !queue.playing)
            return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        const track = queue.current;
        const embed = new discord_js_1.MessageEmbed();
        embed.setColor('RANDOM');
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.title);
        const methods = ['disabled', 'track', 'queue'];
        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        embed.setDescription(`Audio **%${queue.volume}**\nDuration **${trackDuration}**\nLoop Mode **${methods[queue.repeatMode]}**\n${track.requestedBy}`);
        embed.setTimestamp();
        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        const saveButton = new discord_js_1.MessageButton();
        saveButton.setLabel('Save track');
        saveButton.setCustomId('saveTrack');
        saveButton.setStyle('SUCCESS');
        const row = new discord_js_1.MessageActionRow().addComponents(saveButton);
        interaction.reply({ embeds: [embed], components: [row] });
    }
};
