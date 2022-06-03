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
        .setName('userinfo')
        .setDescription('Get information about a user.')
        .addUserOption(option => option
        .setName('target')
        .setDescription('The user to get information about.')
        .setRequired(true)),
    contextMenu: new builders_1.ContextMenuCommandBuilder()
        .setName('userinfo')
        .setType(v9_1.ApplicationCommandType.User),
    category: 'Info',
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMention = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
            let userinfo = {
                bot: userMention.bot,
                createdate: userMention.createdAt,
                discrim: userMention.discriminator,
                id: userMention.id,
                tag: userMention.tag,
                uname: userMention.username,
                avatar: userMention.avatarURL(),
            };
            var myInfo = new discord_js_1.MessageEmbed()
                .setAuthor({ name: userinfo.uname, iconURL: userinfo.avatar })
                .addField("Bot?", userinfo.bot.toString(), true)
                .addField("Created At", userinfo.createdate.toString(), true)
                .addField("Discriminator", userinfo.discrim, true)
                .addField("Client ID", userinfo.id, true)
                .addField("Client Tag", userinfo.tag, true)
                .addField("Username", userinfo.uname, true)
                .setColor('RANDOM')
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                .setTitle("About this user...")
                .setThumbnail(userinfo.avatar);
            interaction.reply({ embeds: [myInfo] });
        });
    },
};
