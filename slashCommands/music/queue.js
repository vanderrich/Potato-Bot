"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const pagination_js_1 = __importDefault(require("../../Util/pagination.js"));
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("queue")
        .setDescription("See the current queue"),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client, footers) {
        var _a, _b;
        const _fromButton = false;
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.current) {
            if (_fromButton)
                return;
            const embed = new discord_js_1.MessageEmbed();
            embed.setTitle('Server Queue');
            embed.setColor('RANDOM');
            embed.setDescription(`No tracks in the queue.`);
            embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
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
                const loopType = queue.repeatMode === 0 ? "None" : queue.repeatMode === 1 ? "Track" : queue.repeatMode === 2 ? "Queue" : queue.repeatMode === 3 ? "Autoplay" : "Impossible edge case, notify developer";
                const embed = new discord_js_1.MessageEmbed();
                embed.setDescription(`${page === 1 ? `Volume: ${queue.volume}%, Loop: ${loopType}\n` : ""}\n\n${usedby}${tracks.join('\n')}${queue.tracks.length > pageEnd
                    ? `\n... ${queue.tracks.length - pageEnd} more track(s)`
                    : ''}`);
                embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                if (page % 2 === 0)
                    embed.setColor('RANDOM');
                else
                    embed.setColor('RANDOM');
                const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                    `${queue.current.author} - ${queue.current.title}` : `${queue.current.title}`;
                if (page === 1)
                    embed.setAuthor({ name: `Now playing: ${title}`, url: `${queue.current.url}` });
                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 1) {
                    const embed = new discord_js_1.MessageEmbed();
                    embed.setColor('RANDOM');
                    embed.setDescription(`${usedby}No more tracks in the queue.`);
                    embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                    const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                        `${queue.current.author} - ${queue.current.title} ` : `${queue.current.title} `;
                    embed.setAuthor({ name: `Now playing: ${title} `, url: `${queue.current.url}` });
                    return _fromButton ? (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embed] }) : interaction.reply({ embeds: [embed] });
                }
                if (page === 2) {
                    return _fromButton ? (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.send({ embeds: [pages[0]] }) : interaction.reply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);
        (0, pagination_js_1.default)(interaction, pages, { timeout: 40000, fromButton: _fromButton, hasSentReply: false });
    },
};
