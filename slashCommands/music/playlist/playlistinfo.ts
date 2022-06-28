import { SlashCommandSubcommandBuilder, userMention, time } from "@discordjs/builders";
import { QueryType } from 'discord-player';
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Music } from "../../../localization.js";
import generatePages from '../../../Util/pagination.js';
import { Client, Playlist, SlashCommand } from "../../../Util/types.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("info")
        .setDescription("Get information about a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist, case sensitive.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;
        const trueLocale = client.getLocale(interaction, "util.true")
        const falseLocale = client.getLocale(interaction, "util.false")
        const playlistName = interaction.options.getString("name");

        const playlist: Playlist | null = await client.playlists.findOne({
            managers: user.id,
            name: playlistName
        });

        if (!playlist?.tracks) return interaction.editReply(locale.noPlaylist);
        if (playlist.tracks.length === 0) return interaction.editReply(locale.emptyPlaylist);

        const pages = [];
        let page = 1, emptypage = false;
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = await Promise.all(playlist.tracks.slice(pageStart, pageEnd).map(async (m, i) => {
                let searchResult = await client.player.search(m, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                });
                if (!searchResult?.tracks) return;
                let track = searchResult.tracks[0];
                const title = ['spotify-custom', 'soundcloud-custom'].includes(track.source) ?
                    `${track.author} - ${track.title}` : `${track.title}`;
                return `**${i + pageStart + 1}**. [${title}](${track.url}) ${track.duration} - ${track.requestedBy}`;
            }));

            if (tracks.length) {
                const loopType = locale.loopType[playlist.settings.loop]
                const embed = new MessageEmbed();
                embed.setDescription(`${page === 1 ? client.getLocale(interaction, "commands.music.playlistSettings", playlist.settings.shuffle ? trueLocale : falseLocale, playlist.settings.volume, loopType) : ""}
                ${tracks.join('\n')}${playlist.tracks.length > pageEnd
                        ? `\n... ${playlist.tracks.length - pageEnd} more track(s)`
                        : ''
                    } `);
                embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                if (page % 2 === 0) embed.setColor('RANDOM');
                else embed.setColor('RANDOM');
                if (page === 1) embed.setTitle(`${playlist.name}`)

                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 1) {
                    const embed = new MessageEmbed();
                    embed.setColor('RANDOM');
                    embed.setDescription(locale.noMoreTracks);
                    embed.setAuthor({ name: `${playlist.name}` });
                    embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                    return interaction.editReply({ embeds: [embed] });
                }
                if (page === 2) {
                    return interaction.editReply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        generatePages(interaction, pages, client, { hasSentReply: true });
    }
} as SlashCommand;