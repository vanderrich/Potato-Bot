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
const users = ["Potato Pocket", "Potato T-Shirt", "Potato Peelers", "Potato Street", "Potato Town"];
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("find")
        .setDescription("Find money"),
    category: "Currency",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let beg = yield client.eco.beg({ user: interaction.user.id, minAmount: 5, maxAmount: 10 });
            if (beg.error)
                return interaction.reply(`Come back after ${beg.time}.`);
            else
                return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}** was somewhat profitable, you found **${beg.amount}** 💸.`);
        });
    }
};
