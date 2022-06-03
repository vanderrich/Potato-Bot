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
    data: new builders_1.SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for money!"),
    category: "Currency",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = [
                "A Stranger",
                "A Potato",
                "A Living being",
                "I forgor :skull:",
                "Someone:tm:",
                "Something:tm:",
            ];
            let result = yield client.eco.beg({ user: interaction.user.id, minAmount: 1, maxAmount: 5 });
            if (result.error)
                return interaction.reply(`You have begged recently Try again in ${result.time}`);
            return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}** donated you **${result.amount}** 💸.`);
        });
    }
};
