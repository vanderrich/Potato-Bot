"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
const pagination_js_1 = __importDefault(require("../../../Util/pagination.js"));
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("info")
        .setDescription("Get information about a playlist.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist, case sensitive.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const user = interaction.user;
            const guild = interaction.guild;
            const playlistName = interaction.options.getString("name");
            const playlist = yield client.playlists.findOne({
                managers: user.id,
                name: playlistName
            });
            if (!(playlist === null || playlist === void 0 ? void 0 : playlist.tracks))
                return interaction.editReply("I couldn't find that playlist!");
            if (playlist.tracks.length === 0)
                return interaction.editReply("That playlist is empty!");
            const pages = [];
            let page = 1, emptypage = false;
            do {
                const pageStart = 10 * (page - 1);
                const pageEnd = pageStart + 10;
                const tracks = yield Promise.all(playlist.tracks.slice(pageStart, pageEnd).map((m, i) => __awaiter(this, void 0, void 0, function* () {
                    let track = yield client.player.search(m, {
                        requestedBy: interaction.member,
                        searchEngine: discord_player_1.QueryType.AUTO
                    });
                    if (!(track === null || track === void 0 ? void 0 : track.tracks))
                        return;
                    track = track.tracks[0];
                    const title = ['spotify-custom', 'soundcloud-custom'].includes(track.source) ?
                        `${track.author} - ${track.title}` : `${track.title}`;
                    return `**${i + pageStart + 1}**. [${title}](${track.url}) ${track.duration} - ${track.requestedBy}`;
                })));
                if (tracks.length) {
                    const loopType = playlist.settings.loop === 0 ? "None" : playlist.settings.loop === 1 ? "Track" : playlist.settings.loop === 2 ? "Queue" : playlist.settings.loop === 3 ? "Autoplay" : "Impossible edge case, notify developer";
                    const embed = new discord_js_1.MessageEmbed();
                    embed.setDescription(`${page === 1 ? `Shuffle: ${playlist.settings.shuffle ? "True" : "False"}, Volume: ${playlist.settings.volume}%, Loop: ${loopType}\n` : ""}
                ${tracks.join('\n')}${playlist.tracks.length > pageEnd
                        ? `\n... ${playlist.tracks.length - pageEnd} more track(s)`
                        : ''} `);
                    embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                    if (page % 2 === 0)
                        embed.setColor('RANDOM');
                    else
                        embed.setColor('RANDOM');
                    if (page === 1)
                        embed.setTitle(`${playlist.name} `);
                    pages.push(embed);
                    page++;
                }
                else {
                    emptypage = true;
                    if (page === 1) {
                        const embed = new discord_js_1.MessageEmbed();
                        embed.setColor('RANDOM');
                        embed.setDescription(`No more tracks in the playlist.`);
                        embed.setAuthor({ name: `${playlist.name} `, url: `${playlist.url} ` });
                        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                        return interaction.editReply({ embeds: [embed] });
                    }
                    if (page === 2) {
                        return interaction.editReply({ embeds: [pages[0]] });
                    }
                }
            } while (!emptypage);
            (0, pagination_js_1.default)(interaction, pages, { hasSentReply: true });
        });
    }
};
