const { SlashCommandSubcommandBuilder, userMention, time } = require("@discordjs/builders");
const { QueryType } = require('discord-player');
const generatePages = require('../../../Util/pagination.js');

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
    async execute(interaction, client, Discord, footers) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");

        const playlist = await client.playlists.findOne({
            managers: user.id,
            name: playlistName
        });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");
        if (playlist.tracks.length === 0) return interaction.editReply("That playlist is empty!");

        const pages = [];
        let page = 1, emptypage = false;
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = await Promise.all(playlist.tracks.slice(pageStart, pageEnd).map(async (m, i) => {
                let track = await client.player.search(m, {
                    requestedBy: interaction.member,
                    searchEngine: QueryType.AUTO
                });
                if (!track?.tracks) return;
                track = track.tracks[0];
                const title = ['spotify-custom', 'soundcloud-custom'].includes(track.source) ?
                    `${track.author} - ${track.title}` : `${track.title}`;
                return `**${i + pageStart + 1}**. [${title}](${track.url}) ${track.duration} - ${track.requestedBy}`;
            }));

            if (tracks.length) {
                const loopType = playlist.settings.loop === 0 ? "None" : playlist.settings.loop === 1 ? "Track" : playlist.settings.loop === 2 ? "Queue" : playlist.settings.loop === 3 ? "Autoplay" : "Impossible edge case, notify developer";
                const embed = new Discord.MessageEmbed();
                embed.setDescription(`${page === 1 ? `Shuffle: ${playlist.settings.shuffle ? "True" : "False"}, Volume: ${playlist.settings.volume}%, Loop: ${loopType}\n` : ""}
                ${tracks.join('\n')}${playlist.tracks.length > pageEnd
                        ? `\n... ${playlist.tracks.length - pageEnd} more track(s)`
                        : ''
                    } `);
                embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: user.avatarURL({ dynamic: true }) });
                if (page % 2 === 0) embed.setColor('RANDOM');
                else embed.setColor('RANDOM');
                if (page === 1) embed.setTitle(`${playlist.name} `)

                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 1) {
                    const embed = new Discord.MessageEmbed();
                    embed.setColor('RANDOM');
                    embed.setDescription(`No more tracks in the playlist.`);
                    embed.setAuthor({ name: `${playlist.name} `, iconURL: null, url: `${playlist.url} ` });
                    embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: user.avatarURL({ dynamic: true }) });
                    return interaction.editReply({ embeds: [embed] });
                }
                if (page === 2) {
                    return interaction.editReply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        generatePages(interaction, pages, { hasSentReply: true });
    }
}