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
        .setName("hourly")
        .setDescription("Get your hourly reward!"),
    category: "Currency",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let amount = Math.floor(Math.random() * 2.0833333333333335 + 1.5166666666666667);
            let addMoney = yield client.eco.hourly({ user: interaction.user.id, amount });
            if (addMoney.error)
                return interaction.reply(`You have already claimed your hourly credit. Come back in ${addMoney.time} to claim it again.`);
            else
                return interaction.reply(`You have claimed **$${addMoney.amount}** as your hourly credit, You now have **$${addMoney.rawData.wallet}** in your wallet.`);
        });
    }
};
