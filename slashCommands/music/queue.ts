import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import generatePages from '../../Util/pagination.js';
import { Track } from "discord-player"
import { Client } from "../../Util/types.js";
import { Music } from "../../localization.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("queue")
        .setDescription("See the current queue"),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const _fromButton = false
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue || !queue.current) {
            if (_fromButton) return;
            const embed = new MessageEmbed();
            embed.setTitle(locale.serverQueue);
            embed.setColor('RANDOM');
            embed.setDescription(locale.noMoreTracks);
            embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            return interaction.reply({ embeds: [embed] });
        }

        const pages = [];
        let page = 1, emptypage = false, usedby = _fromButton ? `[${interaction.member}]\n` : "";
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.slice(pageStart, pageEnd).map((m: Track, i: number) => {
                const title = ['spotify-custom', 'soundcloud-custom'].includes(m.source) ?
                    `${m.author} - ${m.title}` : `${m.title}`;
                return `**${i + pageStart + 1}**. [${title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
            });
            if (tracks.length) {
                const loopType = queue.repeatMode === 0 ? locale.none : queue.repeatMode === 1 ? locale.track : queue.repeatMode === 2 ? locale.queue : locale.autoplay;
                const embed = new MessageEmbed();
                embed.setDescription(`${page === 1 ? client.getLocale(interaction, "commands.music.queueSettings", queue.volume, loopType) : ""}\n\n${usedby}${tracks.join('\n')}${queue.tracks.length > pageEnd
                    ? `\n... ${queue.tracks.length - pageEnd} more track(s)`
                    : ''
                    }`);
                embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                if (page % 2 === 0) embed.setColor('RANDOM');
                else embed.setColor('RANDOM');
                const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                    `${queue.current.author} - ${queue.current.title}` : `${queue.current.title}`;
                if (page === 1) embed.setAuthor({ name: client.getLocale(interaction, "commands.music.nowplaying", title), url: `${queue.current.url}` });
                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 1) {
                    const embed = new MessageEmbed();
                    embed.setColor('RANDOM');
                    embed.setDescription(locale.noMoreTracks);
                    embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                    const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                        `${queue.current.author
                        } - ${queue.current.title} ` : `${queue.current.title} `;
                    embed.setAuthor({ name: client.getLocale(interaction, "commands.music.nowplaying", title), url: `${queue.current.url}` });
                    return _fromButton ? interaction.channel?.send({ embeds: [embed] }) : interaction.reply({ embeds: [embed] });
                }
                if (page === 2) {
                    return _fromButton ? interaction.channel?.send({ embeds: [pages[0]] }) : interaction.reply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        generatePages(interaction, pages, client, { timeout: 40000, fromButton: _fromButton, hasSentReply: false });
    },
};