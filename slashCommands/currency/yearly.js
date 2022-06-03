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
        .setName("yearly")
        .setDescription("Get your yearly reward!"),
    category: "Currency",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let amount = Math.floor(Math.random() * 6000) + 12000;
            let addMoney = yield client.eco.yearly({ user: interaction.user.id, amount });
            if (addMoney.error)
                return interaction.reply(`You have already claimed your yearly credit. Come back in ${addMoney.time} to claim it again.`);
            else
                return interaction.reply(`You have claimed **$${addMoney.amount}** as your yearly credit, You now have **$${addMoney.rawData.wallet}** in your wallet.`);
        });
    }
};
