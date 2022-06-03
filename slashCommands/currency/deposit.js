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
        .setName("deposit")
        .setDescription("Deposit money into your bank account.")
        .addNumberOption(option => option
        .setName("amount")
        .setDescription("The amount to deposit.")
        .setRequired(true)),
    category: "Currency",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let money = interaction.options.getNumber("amount");
            let result = yield client.eco.deposite({
                user: interaction.user.id,
                amount: money
            });
            if (result.error) {
                if (result.type === 'money')
                    return interaction.reply("Specify an amount to deposit");
                if (result.type === 'negative-money')
                    return interaction.reply("Amount must be positive");
                if (result.type === 'low-money')
                    return interaction.reply("You don't have that much money in your wallet.");
                if (result.type === 'no-money')
                    return interaction.reply("You don't have any money to deposit");
                if (result.type === 'bank-full')
                    return interaction.reply("Your bank is full.");
            }
            else {
                if (result.type === 'all-success')
                    return interaction.reply("You have deposited all your money to your bank" + `\nNow you have $${result.rawData.wallet} in your wallet and $${result.rawData.bank} in your bank.`);
                if (result.type === 'success')
                    return interaction.reply(`You have deposited **$${result.amount}** to your bank.\nNow you have **$${result.rawData.wallet}** in your wallet and **$${result.rawData.bank}** in your bank.`);
            }
            ;
        });
    }
};
