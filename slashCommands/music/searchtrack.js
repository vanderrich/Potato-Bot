const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('search')
        .setDescription('Search for a track')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('The track to search for.')
                .setRequired(true)
    ),
    category: 'Music',
    isSubcommand: true,
    async execute(interaction, client, Discord) {
        const res = await client.player.search(interaction.options.getString("query"), {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply(`${interaction.user}, No search results found. ❌`);

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        const embed = new Discord.MessageEmbed();

        embed.setColor('RANDOM');
        embed.setTitle(`Searched Music: ${interaction.options.getString('query')}`);

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nChoose a track from **1** to **${maxTracks.length}** write send or write **cancel** and cancel selection.⬇️`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [embed] });

        const collector = interaction.channel.createMessageCollector({
            time: 15000,
            errors: ['time'],
            filter: m => m.author.id === interaction.user.id
        });

        collector.on('collect', async (query) => {
            if (query.content.toLowerCase() === 'cancel') return interaction.followUp(`Call cancelled. ✅`) && collector.stop();

            const value = parseInt(query.content);

            if (!value || value <= 0 || value > maxTracks.length) return interaction.followUp(`Error: select a track **1** to **${maxTracks.length}** and write send or type **cancel** and cancel selection. ❌`);

            collector.stop();

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                await client.player.deleteQueue(interaction.guild.id);
                return interaction.followUp(`${interaction.user}, I can't join audio channel. ❌`);
            }

            await interaction.followUp(`Loading your music call. 🎧`);

            queue.addTrack(res.tracks[Number(query.content) - 1]);
            if (!queue.playing) await queue.play();

        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time') return interaction.followUp(`${interaction.user}, track search time expired ❌`);
        });
    },
};