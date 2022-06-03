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
        .setName("play")
        .setDescription("Play a playlist.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist to play, case sensitive.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const user = interaction.user;
            const guild = interaction.guild;
            if (!guild)
                return interaction.reply("You can't use this command in a DM!");
            const playlistName = interaction.options.getString("name");
            const playlist = yield client.playlists.findOne({ managers: user.id, name: playlistName });
            if (!(playlist === null || playlist === void 0 ? void 0 : playlist.tracks))
                return interaction.editReply("I couldn't find that playlist!");
            if (playlist.tracks.length === 0)
                return interaction.editReply("That playlist doesn't have any tracks!");
            const res = playlist.tracks;
            const queue = yield client.player.createQueue(interaction.guild, {
                metadata: interaction.channel
            });
            try {
                if (!queue.connection && interaction.member instanceof discord_js_1.GuildMember)
                    yield queue.connect((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.voice.channel);
            }
            catch (_b) {
                yield client.player.deleteQueue(interaction.guild.id);
                return interaction.editReply(`${interaction.user}, I can't join audio channel, try joining to a voice channel or change the permissions of the voice channel. ❌`);
            }
            const tracks = yield res.map((track) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    client.player.search(track, {
                        requestedBy: interaction.member,
                        searchEngine: discord_player_1.QueryType.AUTO
                    }).then((trackToPlay) => {
                        return resolve(trackToPlay.tracks[0]);
                    });
                }));
            }));
            const tracksToPlay = yield Promise.all(tracks);
            queue.addTracks(tracksToPlay);
            if (!queue.playing)
                yield queue.play();
            if (playlist.settings.shuffle) {
                for (let i = queue.tracks.length - 1; i > 0; i--) {
                    queue.shuffle();
                }
            }
            if (playlist.settings.loop)
                queue.setRepeatMode(playlist.settings.loop);
            if (playlist.settings.volume)
                queue.setVolume(playlist.settings.volume);
            interaction.editReply(`Added playlist to the queue! 🎧`);
        });
    }
};
