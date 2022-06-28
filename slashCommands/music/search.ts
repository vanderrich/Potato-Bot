import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Discord from "discord.js";
import { QueryType, Track } from "discord-player"
import { APIMessage, APIInteractionGuildMember } from "discord-api-types/v9"
import { Client } from "../../Util/types";
import { Music } from "../../localization";

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
    async execute(interaction: Discord.CommandInteraction, client: Client, footers: string[], locale: Music) {
        if (!interaction.guild || !interaction.member || interaction.member as APIInteractionGuildMember) return interaction.reply('This command can only be used in a guild.');
        const res = await client.player.search(interaction.options.getString("query")!, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply(locale.noResults);

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        const embed = new Discord.MessageEmbed();

        embed.setColor('RANDOM');
        embed.setTitle(client.getLocale(interaction, "commands.music.searchEmbedTitle", interaction.options.getString("query")));

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track: Track, i: number) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n${locale.chooseTrack}`);

        embed.setTimestamp();
        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });

        interaction.reply({ embeds: [embed] });

        const collector = interaction.channel?.createMessageCollector({
            time: 15000,
            filter: m => m.author.id === interaction.user.id
        });
        if (!collector) return interaction.reply(locale.timeout);

        collector.on('collect', async (query: Discord.Message | APIMessage) => {
            let member = interaction.member
            if (!(member instanceof Discord.GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id)
            if (query as APIMessage) query = await interaction.channel!.messages.fetch(query.id)
            if (query.content.toLowerCase() === 'cancel') {
                interaction.followUp(locale.cancel)
                collector.stop();
                return
            }
            const value = parseInt(query.content);

            if (!value || value <= 0 || value > maxTracks.length) {
                interaction.followUp(locale.invalidTrack);
                return;
            }
            collector.stop();

            try {
                if (!queue.connection) await queue.connect(member.voice.channel!);
            } catch {
                await client.player.deleteQueue(interaction.guildId!);
                interaction.followUp(locale.cantJoin);
                return;
            }

            queue.addTrack(res.tracks[Number(query.content) - 1]);
            if (!queue.playing) await queue.play();
            interaction.followUp(locale.playSuccess);
        });

        collector.on('end', () => {
            interaction.followUp(locale.timeout)
        });
    },
};