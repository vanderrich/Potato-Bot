import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("nowplaying")
        .setDescription("See the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);

        const track = queue.current;

        const embed = new MessageEmbed();

        embed.setColor('RANDOM');
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.title)

        const methods = locale.nowplayingMethods;

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == Infinity ? locale.liveStream : track.duration;

        embed.setDescription(client.getLocale(interaction, 'commands.music.nowplayingDesc', queue.volume, trackDuration, methods[queue.repeatMode], track.requestedBy));

        embed.setTimestamp();
        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });

        const saveButton = new MessageButton();

        saveButton.setLabel('Save track');
        saveButton.setCustomId('saveTrack');
        saveButton.setStyle('SUCCESS');

        const row = new MessageActionRow().addComponents(saveButton);

        interaction.reply({ embeds: [embed], components: [row] });
    }
}