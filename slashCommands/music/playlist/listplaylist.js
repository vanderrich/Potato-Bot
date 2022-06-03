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
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List all playlists."),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.user;
            const playlists = yield client.playlists.find({
                owner: user.id
            });
            if ((playlists === null || playlists === void 0 ? void 0 : playlists.length) == 0)
                return interaction.reply("You don't have any playlists!");
            const embed = new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Your playlists")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            playlists.forEach((playlist) => {
                embed.addField(playlist.name, playlist.tracks.length + " tracks");
            });
            interaction.reply({ embeds: [embed] });
        });
    }
};
