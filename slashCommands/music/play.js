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
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName('play')
        .setDescription('Play a track.')
        .addStringOption(option => option
        .setName('track')
        .setDescription('The url or query of the track to play.')
        .setRequired(true))
        .addIntegerOption(option => option
        .setName('index')
        .setDescription('The index of the track to play.')
        .setRequired(false)),
    category: 'Music',
    isSubcommand: true,
    execute(interaction, client) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild || !(interaction.member instanceof discord_js_1.GuildMember))
                return interaction.reply('You must be in a guild to use this command.');
            yield interaction.deferReply();
            const res = yield client.player.search(interaction.options.getString('track'), {
                requestedBy: interaction.member,
                searchEngine: discord_player_1.QueryType.AUTO
            });
            let run = true;
            if (res.tracks[0].source != 'youtube') {
                interaction.editReply({ content: `The package we use to play music (discord-player) does not support spotify and will search youtube for it, Are you sure you want to continue? (yes if yes and anything else for no)` });
                const filter = (response) => {
                    return response.author.id == interaction.user.id;
                };
                yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    var _a;
                    if (((_a = collected.first()) === null || _a === void 0 ? void 0 : _a.content.toLowerCase()) != 'yes') {
                        run = false;
                        return interaction.editReply({ content: `Canceled playing **${res.tracks[0].title}**` });
                    }
                }).catch(() => {
                    var _a;
                    run = false;
                    return (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ content: "Timeout" });
                }));
            }
            if (!run)
                return;
            let index = interaction.options.getInteger('index');
            if (!res || !res.tracks.length)
                return interaction.editReply(`${interaction.user}, No results found! ❌`);
            const queue = yield client.player.createQueue(interaction.guild, {
                metadata: interaction.channel
            });
            try {
                if (!queue.connection)
                    yield queue.connect((_b = interaction.member) === null || _b === void 0 ? void 0 : _b.voice.channel);
            }
            catch (_c) {
                yield client.player.deleteQueue(interaction.guild.id);
                return interaction.editReply(`${interaction.user}, I can't join audio channel, try joining to a voice channel or change the permissions of the voice channel. ❌`);
            }
            res.playlist ? queue.addTracks(res.tracks) : index ? queue.insert(res.tracks[0], index - 1) : queue.addTracks(res.tracks);
            if (!queue.playing)
                yield queue.play();
            interaction.editReply(`Added ${res.playlist ? 'playlist' : 'track'} to the queue! 🎧`);
        });
    }
};
