const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const generatePages = require('../../pagination.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("queue")
        .setDescription("See the current queue"),
    execute(interaction, client, Discord) {
        const _fromButton = false
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.current) {
            if (_fromButton) return;
            const embed = new Discord.MessageEmbed();
            embed.setTitle('Server Queue');
            embed.setColor('#b84e44');
            embed.setDescription(`No songs in the queue.`);
            return interaction.reply({ embeds: [embed] });
        }

        const pages = [];
        let page = 1, emptypage = false, usedby = _fromButton ? `[${interaction.member}]\n` : "";
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
                const title = ['spotify-custom', 'soundcloud-custom'].includes(m.source) ?
                    `${m.author} - ${m.title}` : `${m.title}`;
                return `**${i + pageStart + 1}**. [${title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
            });
            if (tracks.length) {
                const embed = new Discord.MessageEmbed();
                embed.setDescription(`${usedby}${tracks.join('\n')}${queue.tracks.length > pageEnd
                    ? `\n... ${queue.tracks.length - pageEnd} more track(s)`
                    : ''
                    }`);
                if (page % 2 === 0) embed.setColor('#b84e44');
                else embed.setColor('#44b868');
                const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                    `${queue.current.author} - ${queue.current.title}` : `${queue.current.title}`;
                const totalTime = `${Math.floor(queue.totalTime % 2160)}:${queue.totalTime % (360)}:${queue.totalTime % 60}`
                if (page === 1) embed.setAuthor({ name: `Now playing: ${title}, Total time: ${totalTime}`, iconURL: null, url: `${queue.current.url}` });
                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 1) {
                    const embed = new Discord.MessageEmbed();
                    embed.setColor('#44b868');
                    embed.setDescription(`${usedby}No more songs in the queue.`);
                    const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                        `${queue.current.author
                        } - ${queue.current.title} ` : `${queue.current.title} `;
                    embed.setAuthor({ name: `Now playing: ${title} `, iconURL: null, url: `${queue.current.url}` });
                    return _fromButton ? interaction.channel.send({ embeds: [embed] }) : interaction.reply({ embeds: [embed] });
                }
                if (page === 2) {
                    return _fromButton ? interaction.channel.send({ embeds: [pages[0]] }) : interaction.reply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        generatePages(interaction, pages, { timeout: 40000, fromButton: _fromButton });
    },
};