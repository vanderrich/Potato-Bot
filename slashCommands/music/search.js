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
const discord_js_1 = __importDefault(require("discord.js"));
const discord_player_1 = require("discord-player");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName('search')
        .setDescription('Search for a track')
        .addStringOption(option => option
        .setName('query')
        .setDescription('The track to search for.')
        .setRequired(true)),
    category: 'Music',
    isSubcommand: true,
    execute(interaction, client, foo, footers) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild || !interaction.member || interaction.member)
                return interaction.reply('This command can only be used in a guild.');
            const res = yield client.player.search(interaction.options.getString("query"), {
                requestedBy: interaction.member,
                searchEngine: discord_player_1.QueryType.AUTO
            });
            if (!res || !res.tracks.length)
                return interaction.reply(`${interaction.user}, No search results found. ❌`);
            const queue = yield client.player.createQueue(interaction.guild, {
                metadata: interaction.channel
            });
            const embed = new discord_js_1.default.MessageEmbed();
            embed.setColor('RANDOM');
            embed.setTitle(`Searched Music: ${interaction.options.getString('query')}`);
            const maxTracks = res.tracks.slice(0, 10);
            embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nChoose a track from **1** to **${maxTracks.length}** write send or write **cancel** and cancel selection.⬇️`);
            embed.setTimestamp();
            embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            interaction.reply({ embeds: [embed] });
            const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageCollector({
                time: 15000,
                filter: m => m.author.id === interaction.user.id
            });
            if (!collector)
                return interaction.reply(`${interaction.user}, Timeout.`);
            collector.on('collect', (query) => __awaiter(this, void 0, void 0, function* () {
                if (!interaction.guild || !interaction.member || !(interaction.member instanceof discord_js_1.default.GuildMember)) {
                    interaction.reply('This command can only be used in a guild.');
                    return;
                }
                if (query) {
                    interaction.followUp(`Call canceled. ✅`);
                    collector.stop();
                    return;
                }
                if (query.content.toLowerCase() === 'cancel') {
                    interaction.followUp(`Call cancelled. ✅`);
                    collector.stop();
                    return;
                }
                const value = parseInt(query.content);
                if (!value || value <= 0 || value > maxTracks.length) {
                    interaction.followUp(`Error: select a track **1** to **${maxTracks.length}** and write send or type **cancel** and cancel selection. ❌`);
                    return;
                }
                collector.stop();
                try {
                    if (!queue.connection)
                        yield queue.connect(interaction.member.voice.channel);
                }
                catch (_b) {
                    yield client.player.deleteQueue(interaction.guild.id);
                    interaction.followUp(`${interaction.user}, I can't join audio channel. ❌`);
                    return;
                }
                yield interaction.followUp(`Loading your music call. 🎧`);
                queue.addTrack(res.tracks[Number(query.content) - 1]);
                if (!queue.playing)
                    yield queue.play();
            }));
            collector.on('end', () => {
                interaction.followUp(`${interaction.user}, track search time expired ❌`);
            });
        });
    },
};
