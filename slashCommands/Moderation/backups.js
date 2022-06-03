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
const builders_1 = require("@discordjs/builders");
const discord_backup_1 = __importDefault(require("discord-backup"));
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("backups")
        .setDescription("List all backups"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const backups = yield discord_backup_1.default.list();
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Backups")
                .setDescription("Here are all the backups of this server")
                .setColor('RANDOM')
                .addFields(backups.map(backupID => ({
                name: `Backup ${backupID}`,
                value: '<insert placeholder here>',
            })))
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            interaction.reply({ embeds: [embed] });
        });
    }
};
