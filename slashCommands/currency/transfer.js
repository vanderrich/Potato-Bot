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
        .setName("transfer")
        .setDescription("Transfer money to another user")
        .addUserOption(option => option
        .setName("user")
        .setDescription("The user you want to transfer to")
        .setRequired(true))
        .addIntegerOption(option => option
        .setName("amount")
        .setDescription("The amount of money you want to transfer")
        .setRequired(true)),
    category: "Currency",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = interaction.options.getUser("user");
            if (!user)
                return interaction.reply("Please enter a valid user!");
            if (user == interaction.user)
                return interaction.reply("You cant transfer money to yourself!");
            let amount = interaction.options.getInteger("amount");
            if (!amount || isNaN(amount) || amount < 0)
                return interaction.reply('Please enter a valid amount to transfer');
            let result = yield client.eco.transferMoney({ user: interaction.user.id, user2: user.id, amount });
            if (result.error)
                return interaction.reply('Looks like you don\'t have that much money');
            return interaction.reply(`You have successfully transferred **$${amount}** to **${user}**.`);
        });
    }
};
