import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("nowplaying")
        .setDescription("See the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const track = queue.current;

        const embed = new MessageEmbed();

        embed.setColor('RANDOM');
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.title)

        const methods = ['disabled', 'track', 'queue'];

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

        embed.setDescription(`Audio **%${queue.volume}**\nDuration **${trackDuration}**\nLoop Mode **${methods[queue.repeatMode]}**\n${track.requestedBy}`);

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