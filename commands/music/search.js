const { QueryType } = require('discord-player');
const playdl = require('play-dl');

module.exports = {
    name: 'search',
    aliases: [],
    utilisation: 'search [song name]',
    category: "Music",
    async execute(message, args, cmd, client, Discord) {

        if (!args[0]) return message.reply(`${message.author}, Please enter a valid song name. ❌`);

        const res = await client.player.search(args.join(' '), {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.reply(`${message.author}, No search results found. ❌`);

        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel,
            async onBeforeCreateStream(track, source, _queue) {
                return (await playdl.stream(track.url)).stream;
            },
        });

        const embed = new Discord.MessageEmbed();

        embed.setColor('RANDOM');
        embed.setTitle(`Searched Music: ${args.join(' ')}`);

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nChoose a song from **1** to **${maxTracks.length}** write send or write **cancel** and cancel selection.⬇️`);

        embed.setTimestamp();
        embed.setFooter('Music Code by Umut Bayraktar aka 1umutda', message.author.avatarURL({ dynamic: true }));

        message.reply({ embeds: [embed] });

        const collector = message.channel.createMessageCollector({
            time: 15000,
            errors: ['time'],
            filter: m => m.author.id === message.author.id
        });

        collector.on('collect', async (query) => {
            if (query.content.toLowerCase() === 'cancel') return message.reply(`Call cancelled. ✅`) && collector.stop();

            const value = parseInt(query.content);

            if (!value || value <= 0 || value > maxTracks.length) return message.reply(`Error: select a song **1** to **${maxTracks.length}** and write send or type **cancel** and cancel selection. ❌`);

            collector.stop();

            try {
                if (!queue.connection) await queue.connect(message.member.voice.channel);
            } catch {
                await client.player.deleteQueue(message.guild.id);
                return message.reply(`${message.author}, I can't join audio channel. ❌`);
            }

            await message.reply(`Loading your music call. 🎧`);

            queue.addTrack(res.tracks[Number(query.content) - 1]);
            if (!queue.playing) await queue.play();

        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time') return message.reply(`${message.author}, Song search time expired ❌`);
        });
    },
};