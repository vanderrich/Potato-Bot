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
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("unshare")
        .setDescription("Unshare a playlist.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist, case sensitive.")
        .setRequired(true))
        .addUserOption(option => option
        .setName("user")
        .setDescription("The user to unshare the playlist with.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const user = interaction.user;
            const guild = interaction.guild;
            const playlistName = interaction.options.getString("name");
            const playlist = yield client.playlists.findOne({ managers: user.id, name: playlistName });
            if (!(playlist === null || playlist === void 0 ? void 0 : playlist.tracks))
                return interaction.editReply("I couldn't find that playlist!");
            if (playlist.tracks.length === 0)
                return interaction.editReply("That playlist doesn't have any tracks!");
            const res = playlist.tracks;
            const userToShare = interaction.options.getUser("user");
            if (!userToShare)
                return interaction.editReply("You must specify a user!");
            const userToSharePlaylist = yield client.playlists.findOne({ creator: userToShare.id, name: playlistName });
            if (!userToSharePlaylist)
                return interaction.editReply(`${userToShare} doesn't have a playlist with that name!`);
            const index = playlist.managers.indexOf(userToShare.id);
            if (index === -1)
                return interaction.editReply(`${userToShare} doesn't have a playlist with that name!`);
            playlist.managers.splice(index, 1);
            playlist.save();
            return interaction.editReply(`Successfully unshared playlist **${playlistName}** with ${userToShare}`);
        });
    }
};
