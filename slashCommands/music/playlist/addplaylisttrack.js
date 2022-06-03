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
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Add a track to a playlist.")
        .addStringOption(option => option
        .setName("url")
        .setDescription("The URL or query of the track to add.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist to add the track to, case sensitive.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const user = interaction.user;
            const guild = interaction.guild;
            const playlistName = interaction.options.getString("name");
            const url = interaction.options.getString("url");
            const track = yield client.player.search(url, {
                requestedBy: interaction.member,
                searchEngine: discord_player_1.QueryType.AUTO
            });
            if (!track)
                return interaction.editReply("I couldn't find that track!");
            if (track.tracks[0].source !== "youtube")
                return interaction.editReply("I can't play non YouTube videos!");
            const playlist = yield client.playlists.findOne({
                managers: user.id,
                name: playlistName
            });
            if (!(playlist === null || playlist === void 0 ? void 0 : playlist.tracks))
                return interaction.editReply("I couldn't find that playlist!");
            playlist.tracks = playlist.tracks.concat(track.tracks.map((t) => t.url));
            playlist.save();
            interaction.editReply(`Added track to the playlist **${playlistName}**`);
        });
    }
};
