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
        .setName("create")
        .setDescription("Create a playlist.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.user;
            const guild = interaction.guild;
            const playlistName = interaction.options.getString("name");
            if (yield client.playlists.findOne({ managers: user.id, name: playlistName }))
                return interaction.reply("You already have a playlist with that name!");
            const playlist = new client.playlists({
                name: playlistName,
                creator: user.id,
                managers: [user.id],
                tracks: [],
                settings: {
                    volume: 75,
                    shuffle: false,
                    loop: 0,
                }
            });
            yield playlist.save();
            interaction.reply(`Created playlist **${playlistName}**`);
        });
    }
};
