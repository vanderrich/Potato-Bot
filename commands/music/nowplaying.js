module.exports = {
    name: "nowplaying",
    aliases: ['np'],
    category: "Music",
    execute(message, args, cmd, client, Discord) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

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
        embed.setFooter('Music Code by Umut Bayraktar aka 1umutda', message.author.avatarURL({ dynamic: true }));

        const saveButton = new Discord.MessageButton();

        saveButton.setLabel('Save Song');
        saveButton.setCustomId('saveTrack');
        saveButton.setStyle('SUCCESS');

        const row = new Discord.MessageActionRow().addComponents(saveButton);

        message.channel.send({ embeds: [embed], components: [row] });
    }
}