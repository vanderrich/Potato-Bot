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
const config_json_1 = require("../../config.json");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("addmoney")
        .setDescription("Add money to a user.")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to add money to.")
        .setRequired(true))
        .addIntegerOption(option => option
        .setName("amount")
        .setDescription("The amount of money to add.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("place")
        .setDescription("The place to add the money to.")
        .addChoices({ name: "Bank", value: "bank" }, { name: "Wallet", value: "wallet" })
        .setRequired(true)),
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_json_1.admins.includes(interaction.user.id))
                return; // return if author isn't bot owner
            let user = interaction.options.getUser("target");
            if (!user)
                return interaction.reply("Please specify a user!");
            let amount = interaction.options.getInteger("amount");
            let place = interaction.options.getString("place");
            if (!place)
                return interaction.reply("Please specify a place!");
            let data = yield client.eco.addMoney({ user: user.id, amount, wheretoPutMoney: place });
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Money Added!`)
                .setDescription(`User: <@${user.id}>\nBalance Given: ${amount}\nTotal Amount: ${data.rawData[place]}`)
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            return interaction.reply({ embeds: [embed] });
        });
    }
};
