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
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("removebackup")
        .setDescription("Remove a backup")
        .addStringOption(option => option
        .setName("id")
        .setDescription("The ID of the backup to load")
        .setRequired(true)),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.deferReply();
            const backupID = interaction.options.getString("id");
            if (!backupID)
                return interaction.reply("Please provide a backup ID.");
            discord_backup_1.default.remove(backupID)
                .then(() => { interaction.editReply("Backup removed!"); })
                .catch(err => { interaction.editReply("Error removing backup: " + err); });
        });
    }
};
