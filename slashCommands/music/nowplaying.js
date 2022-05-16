const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("nowplaying")
        .setDescription("See the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client, Discord) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const track = queue.current;

        const embed = new Discord.MessageEmbed();

        embed.setColor('RANDOM');
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.title)

        const methods = ['disabled', 'track', 'queue'];

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

        embed.setDescription(`Audio **%${queue.volume}**\nDuration **${trackDuration}**\nLoop Mode **${methods[queue.repeatMode]}**\n${track.requestedBy}`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.avatarURL({ dynamic: true }) });

        const saveButton = new Discord.MessageButton();

        saveButton.setLabel('Save Song');
        saveButton.setCustomId('saveTrack');
        saveButton.setStyle('SUCCESS');

        const row = new Discord.MessageActionRow().addComponents(saveButton);

        interaction.reply({ embeds: [embed], components: [row] });
    }
}