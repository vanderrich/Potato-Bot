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
        .setName("delete")
        .setDescription("Delete a playlist.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the playlist, case sensitive.")
        .setRequired(true)),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = interaction.options.getString("name");
            const deleted = yield client.playlists.deleteOne({
                creator: interaction.user.id,
                name: name
            });
            if (deleted.deletedCount === 0)
                return interaction.reply("I couldn't find that playlist!");
            interaction.reply(`Successfully deleted playlist **${name}**.`);
        });
    }
};
