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
        .setName("sell")
        .setDescription("Sell an item")
        .addNumberOption(option => option
        .setName("item")
        .setDescription("The item you want to sell")
        .setAutocomplete(true)
        .setRequired(true)),
    category: "Currency",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield client.eco.removeUserItem({
                user: interaction.user.id,
                item: interaction.options.getNumber("item"),
            });
            if (result.error) {
                if (result.type == 'Invalid-Item-Number')
                    return interaction.reply('Please enter the item number to remove!');
                if (result.type == 'Unknown-Item')
                    return interaction.reply('The item doesn\'t exist!');
            }
            else {
                let shopItem = yield client.eco.getShopItems({ user: interaction.user.id });
                let item = shopItem.inventory.find((item) => item.name === result.inventory.name);
                if (item) {
                    client.eco.removeMoney({ user: interaction.user.id, amount: item.price, whereToPutMoney: 'wallet' });
                    return interaction.reply(`You have sold **${result.inventory.name}** for **$${item.price}**`);
                }
                else {
                    return interaction.reply('The item doesn\'t exist!');
                }
            }
        });
    }
};
