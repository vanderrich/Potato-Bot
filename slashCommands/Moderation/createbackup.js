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
        .setName("createbackup")
        .setDescription("Create a backup of the server"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.deferReply();
            if (!interaction.guild)
                return interaction.reply("You can't use this command in a DM!");
            discord_backup_1.default.create(interaction.guild).then((backupData) => {
                interaction.editReply("Backup created! ID: " + backupData.id);
            }).catch(err => {
                interaction.editReply("Error creating backup: " + err);
            });
        });
    }
};
