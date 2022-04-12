module.exports = {
    name: 'queue',
    aliases: ['q'],
    utilisation: '{prefix}queue',
    voiceChannel: true,
    category: "Music",
    execute(message, args, cmd, client, Discord) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        if (!queue.tracks[0]) return message.reply(`${message.author}, No music in queue after current. ❌`);

        const embed = new Discord.MessageEmbed();
        const methods = ['🔁', '🔂'];

        embed.setColor('RANDOM');
        embed.setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setTitle(`Server Music List - ${message.guild.name} ${methods[queue.repeatMode]}`);

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (Started by <@${track.requestedBy.id}>)`);

        embed.setDescription(`Currently Playing: \`${queue.current.title}\`\n\n${tracks.join('\n')}`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda' }, message.author.avatarURL({ dynamic: true }));

        message.reply({ embeds: [embed] });
    },
};