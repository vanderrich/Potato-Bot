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
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove your birthday data."),
    category: "Info",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.user;
            if (!client.birthdays.findOne({ userId: user.id }))
                return interaction.reply("You don't have any birthday data!");
            client.birthdays.deleteOne({ userId: user.id })
                .then(() => {
                interaction.reply("Your birthday data has been removed!");
                console.log(`[INFO] ${user.tag} removed their birthday data`);
            })
                .catch((err) => {
                console.error(err);
                interaction.reply("Something went wrong! Error: " + err);
            });
        });
    }
};
