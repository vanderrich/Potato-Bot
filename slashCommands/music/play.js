const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('play')
        .setDescription('Play a track.')
        .addStringOption(option => option
            .setName('track')
            .setDescription('The url or query of the track to play.')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('index')
            .setDescription('The index of the track to play.')
            .setRequired(false)
    ),
    category: 'Music',
    async execute(interaction, client) {
        interaction.deferReply()
        const res = await client.player.search(interaction.options.getString('track'), {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });
        let index = interaction.options.getInteger('index') || 1;

        if (!res || !res.tracks.length) return interaction.editReply(`${interaction.user}, No results found! ❌`);

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.editReply(`${interaction.user}, I can't join audio channel, try joining to a voice channel or change the permissions of the voice channel. ❌`);
        }


        res.playlist ? queue.addTracks(res.tracks) : queue.insert(res.tracks[0], index - 1);

        if (!queue.playing) await queue.play();

        await interaction.editReply(`Added ${res.playlist ? 'playlist' : 'track'} to the queue! 🎧`);
    }
}