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
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .addStringOption(option => option
        .setName("item")
        .setDescription("The ID of the item you want to buy.")
        .setAutocomplete(true))
        .addIntegerOption(option => option
        .setName("amount")
        .setDescription("The amount to buy.")),
    category: "Currency",
    execute(interaction, client, footers) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let item = interaction.options.getString("item");
            let amount = interaction.options.getInteger("amount") || 1;
            let local = item === null || item === void 0 ? void 0 : item.endsWith("_local");
            console.log(item, local);
            if (!item) {
                let items = yield client.eco.getShopItems({ guild: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id });
                let globalItems = yield client.eco.getShopItems({ user: interaction.user.id });
                let inv = items.inventory.concat(globalItems.inventory);
                let embed = new discord_js_1.MessageEmbed()
                    .setTitle("Store")
                    .setColor("RANDOM")
                    .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                for (let key in inv) {
                    embed.addField(`${parseInt(key) + 1} - Price: $${inv[key].price} - **${inv[key].name}:**`, inv[key].description);
                }
                return interaction.reply({ embeds: [embed] });
            }
            yield interaction.deferReply();
            if (local) {
                let items = yield client.eco.getShopItems({ guild: interaction.guildId });
                let shopItem = items.inventory.find((i) => i.id == (item === null || item === void 0 ? void 0 : item.replace("_local", "")));
                if (!shopItem) {
                    return interaction.editReply("Item not found!");
                }
                if (shopItem.price * amount > (yield client.eco.balance({ user: interaction.user.id }))) {
                    return interaction.editReply("You don't have enough money!");
                }
                yield client.eco.addMoney({ user: interaction.user.id, amount: shopItem.price * amount, whereToPutMoney: "wallet" });
            }
            let result = yield client.eco.addUserItem({
                user: interaction.user.id,
                guild: local ? interaction.guild : undefined,
                item: local ? parseInt(item.replace("_local", "")) : parseInt(item),
            });
            console.log(result);
            if (result.error) {
                if (result.type === 'No-Item')
                    return interaction.editReply('Please provide valid item number');
                if (result.type === 'Invalid-Item')
                    return interaction.editReply('Item does not exist');
                if (result.type === 'low-money')
                    return interaction.editReply(`You're too broke to buy this item.`);
            }
            else
                return interaction.editReply(`Successfully bought **${result.inventory.name}** for $${result.inventory.price}`);
        });
    }
};
