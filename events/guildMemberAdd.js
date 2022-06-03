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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config.json");
const discord_js_1 = __importDefault(require("discord.js"));
module.exports = {
    name: 'guildMemberAdd',
    execute(newMember, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const guildSettings = yield client.guildSettings.findOne({ guildId: newMember.guild.id });
            const welcomeChannel = newMember.guild.channels.cache.get(guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.welcomeChannel) || newMember.guild.channels.cache.find(channel => channel.name.includes('welcome')) || newMember.guild.channels.cache.find(channel => channel.name.includes('general'));
            if (newMember.user.bot || !welcomeChannel)
                return;
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle((guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.welcomeMessage) || 'New Member!')
                .setDescription(`${newMember.user}`)
                .setFooter({ text: config_json_1.footers[Math.floor(Math.random() * config_json_1.footers.length)], iconURL: newMember.user.displayAvatarURL({ dynamic: true }) ? newMember.user.displayAvatarURL({ dynamic: true }) : undefined });
            newMember.user.avatarURL() ? embed.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true })) : "";
            if (welcomeChannel.isText())
                welcomeChannel.send({ embeds: [embed] });
            if (guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.welcomeRole) {
                const role = newMember.guild.roles.cache.get(guildSettings.welcomeRole);
                if (role == undefined)
                    return;
                newMember.roles.add(role);
            }
        });
    }
};
