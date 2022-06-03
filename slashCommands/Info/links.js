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
        .setName('links')
        .setDescription('Links'),
    category: "Info",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Links")
                .setDescription(`[**Github**](https://github.com/vanderrich/Potato-Bot)\n[**Discord Server**](https://discord.gg/cHj7nErGBa)\n[**Invite**](https://discord.com/api/oauth2/authorize?client_id=894060283373449317&permissions=8&scope=bot%20applications.commands)\n[**Trello**](https://trello.com/b/65PWS20u)`)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            interaction.reply({ embeds: [embed] });
        });
    },
};
