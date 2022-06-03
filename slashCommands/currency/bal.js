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
const v9_1 = require("discord-api-types/v9");
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("bal")
        .setDescription("Check your balance.")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to check the balance of.")
        .setRequired(true)),
    contextMenu: new builders_1.ContextMenuCommandBuilder()
        .setName("bal")
        .setType(v9_1.ApplicationCommandType.User),
    category: "Currency",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
            let userInfo = yield client.eco.balance({ user: user.id });
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`${user.username}'s Balance`)
                .addField(`Wallet`, `${userInfo.wallet}`)
                .addField(`Bank`, `${userInfo.bank}`)
                .addField(`Total`, `${userInfo.networth}`)
                .setColor("RANDOM")
                .setThumbnail(user.displayAvatarURL)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        });
    }
};
