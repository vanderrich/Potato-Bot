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
        .setName("addshopitem")
        .setDescription("Add a shop item.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the item.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("description")
        .setDescription("The description of the item.")
        .setRequired(true))
        .addNumberOption(option => option
        .setName("price")
        .setDescription("The price of the item.")
        .setRequired(true)),
    category: "Currency",
    permissions: "ADMINISTRATOR",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = interaction.options.getString("name");
            const description = interaction.options.getString("description");
            const price = interaction.options.getNumber("price");
            if (!price)
                return interaction.reply("You can't add an item for less than 1$!");
            if (!interaction.guild)
                return interaction.reply("You can't add an item in a DM!");
            let result = yield client.eco.addItem({
                guild: interaction.guild.id,
                inventory: {
                    name: name,
                    price: price,
                    description: description
                }
            });
            if (result.error) {
                if (result.type == 'No-Inventory-Name')
                    return interaction.reply('Enter item name to add!');
                if (result.type == 'Invalid-Inventory-Price')
                    return interaction.reply('Invalid price!');
                if (result.type == 'No-Inventory-Price')
                    return interaction.reply('You didnt specify the price!');
                if (result.type == 'No-Inventory')
                    return interaction.reply('No data received!');
            }
            else
                return interaction.reply('Successfully added `' + name + '` to the shop!');
        });
    }
};
