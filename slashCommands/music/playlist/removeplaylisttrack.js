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
        .setName("remove")
        .setDescription("Remove a track from a playlist.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist to add the track to, case sensitive.")
        .setRequired(true))
        .addIntegerOption(option => option
        .setName("index")
        .setDescription("The index to remove")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlistName = interaction.options.getString("name");
            const index = interaction.options.getInteger("index");
            const playlist = yield client.playlists.findOne({
                managers: interaction.user.id,
                name: playlistName
            });
            if (!(playlist === null || playlist === void 0 ? void 0 : playlist.tracks))
                return interaction.reply("I couldn't find that playlist!");
            if (!index)
                return interaction.reply("You must specify an index!");
            playlist.tracks.splice(index - 1, 1);
            playlist.save();
            interaction.reply(`Removed track from the playlist **${playlistName}**`);
        });
    }
};
