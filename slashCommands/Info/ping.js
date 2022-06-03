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
        .setName('ping')
        .setDescription('Pong!'),
    category: "Info",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed();
            const ping = Date.now() - interaction.createdTimestamp;
            const fieldMessage = (ping < 0) ? "How much caffeine did i drink?" : (ping < 1) ? "Lightning Fast" : (ping < 5) ? "Very Fast" : (ping < 10) ? "Quite Fast" : (ping < 15) ? "Fast" : (ping < 50) ? "Moderately Fast" : (ping < 100) ? "Faster than normal" : (ping < 500) ? "Normal" : (ping < 1000) ? "Slower than normal" : (ping < 2500) ? "Quite Slow" : (ping < 5000) ? "Very Slow" : (ping < 10000) ? "Insanely Slow" : "Is the bot dead???";
            embed.setTitle("Pong!");
            embed.setDescription(`**Ping is ${ping}ms. API Latency is ${Math.round(client.ws.ping)}ms**`);
            embed.addField("In words", `${fieldMessage}`, true);
            embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            interaction.reply({ embeds: [embed] });
        });
    },
};
