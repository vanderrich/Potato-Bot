import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { QueryType } from 'discord-player';
import { CommandInteraction, GuildMember, Message } from 'discord.js';
import { Client } from '../../Util/types';

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
    isSubcommand: true,
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: Client) {
        let member = interaction.member;
        if (!(member instanceof GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id);
        await interaction.deferReply()
        const res = await client.player.search(interaction.options.getString('track')!, {
            requestedBy: member,
            searchEngine: QueryType.AUTO
        });
        let run = true;
        if (res.tracks[0].source != 'youtube') {
            interaction.editReply({ content: `The package we use to play music (discord-player) does not support spotify and will search youtube for it, Are you sure you want to continue? (yes if yes and anything else for no)` });
            const filter = (response: Message) => {
                return response.author.id == interaction.user.id
            }
            await interaction.channel?.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(collected => {
                if (collected.first()?.content.toLowerCase() != 'yes') {
                    run = false
                    return interaction.editReply({ content: `Canceled playing **${res.tracks[0].title}**` });
                }
            }).catch(() => {
                run = false
                return interaction.channel?.send({ content: "Timeout" });
            });
        }
        if (!run) return;

        let index = interaction.options.getInteger('index');

        if (!res || !res.tracks.length) return interaction.editReply(`${interaction.user}, No results found! ❌`);

        const queue = await client.player.createQueue(interaction.guild!, {
            metadata: interaction.channel,
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 10000,
            autoSelfDeaf: true,
            initialVolume: 75
        });

        try {
            if (!queue.connection) await queue.connect(member.voice.channel!);
        } catch {
            await client.player.deleteQueue(interaction.guild!.id);
            return interaction.editReply(`${interaction.user}, I can't join audio channel, try joining to a voice channel or change the permissions of the voice channel. ❌`);
        }


        res.playlist ? queue.addTracks(res.tracks) : index ? queue.insert(res.tracks[0], index - 1) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();

        interaction.editReply(`Added ${res.playlist ? 'playlist' : 'track'} to the queue! 🎧`);
    }
}