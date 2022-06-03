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
        .setName("lb")
        .setDescription("See the leaderboard!"),
    category: "Currency",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            let leaderboard = yield client.eco.globalLeaderboard();
            if (!leaderboard || leaderboard.length < 1)
                return interaction.reply("❌ | Empty Leaderboard!");
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Leaderboard`)
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            let pos = 0;
            leaderboard.slice(0, 10).map((user) => {
                if (!client.users.cache.get(user.userID))
                    return;
                pos++;
                embed.addField(`${pos} - **${client.users.cache.get(user.userID).username}**`, `Wallet: **${user.wallet}** - Bank: **${user.bank}**`);
            });
            return interaction.reply({ embeds: [embed] });
        });
    }
};
