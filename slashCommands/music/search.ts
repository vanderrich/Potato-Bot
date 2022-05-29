import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Discord, { GuildMember } from "discord.js";
import { QueryType, Track } from "discord-player"
import { APIMessage, APIInteractionGuildMember } from "discord-api-types"

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
    async execute(interaction: Discord.CommandInteraction, client: any, foo: any, footers: string[]) {
        if (!interaction.guild || !interaction.member || interaction.member as APIInteractionGuildMember) return interaction.reply('This command can only be used in a guild.');
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

        embed.setDescription(`${maxTracks.map((track: Track, i: number) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nChoose a track from **1** to **${maxTracks.length}** write send or write **cancel** and cancel selection.⬇️`);

        embed.setTimestamp();
        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });

        interaction.reply({ embeds: [embed] });

        const collector = interaction.channel?.createMessageCollector({
            time: 15000,
            filter: m => m.author.id === interaction.user.id
        });
        if (!collector) return interaction.reply(`${interaction.user}, Timeout.`);

        collector.on('collect', async (query: any) => {
            if (!interaction.guild || !interaction.member || !(interaction.member instanceof GuildMember)) {
                interaction.reply('This command can only be used in a guild.');
                return;
            }
            if (query as APIMessage) {
                interaction.followUp(`Call canceled. ✅`)
                collector.stop();
                return
            }
            if (query.content.toLowerCase() === 'cancel') {
                interaction.followUp(`Call cancelled. ✅`)
                collector.stop();
                return
            }
            const value = parseInt(query.content);

            if (!value || value <= 0 || value > maxTracks.length) {
                interaction.followUp(`Error: select a track **1** to **${maxTracks.length}** and write send or type **cancel** and cancel selection. ❌`);
                return;
            }
            collector.stop();

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                await client.player.deleteQueue(interaction.guild.id);
                interaction.followUp(`${interaction.user}, I can't join audio channel. ❌`);
                return;
            }

            await interaction.followUp(`Loading your music call. 🎧`);

            queue.addTrack(res.tracks[Number(query.content) - 1]);
            if (!queue.playing) await queue.play();

        });

        collector.on('end', () => {
            interaction.followUp(`${interaction.user}, track search time expired ❌`)
        });
    },
};