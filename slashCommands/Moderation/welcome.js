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
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("welcome")
        .setDescription("Welcome stuff")
        .addStringOption(option => option
        .setName("message")
        .setDescription("The welcome message.")
        .setRequired(false))
        .addRoleOption(option => option
        .setName("role")
        .setDescription("The role to give to the user.")
        .setRequired(false))
        .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to send the welcome message.")
        .setRequired(false)),
    category: "Moderation",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = interaction.options.getString("message");
            const role = interaction.options.getRole("role");
            const channel = interaction.options.getChannel("channel");
            if (!interaction.guild)
                return interaction.reply("You can't use this command in a DM!");
            const guildSettings = yield client.guildSettings.findOne({ guildId: interaction.guild.id });
            if (!guildSettings) {
                const guildSettings = new client.guildSettings({
                    guildId: interaction.guild.id,
                    welcomeMessage: message,
                    welcomeRole: role === null || role === void 0 ? void 0 : role.id,
                    welcomeChannel: channel === null || channel === void 0 ? void 0 : channel.id
                });
                guildSettings.save();
            }
            else {
                guildSettings.welcomeMessage = message;
                guildSettings.welcomeRole = role === null || role === void 0 ? void 0 : role.id;
                guildSettings.welcomeChannel = channel === null || channel === void 0 ? void 0 : channel.id;
                guildSettings.save();
            }
            interaction.reply("Updated settings.");
        });
    }
};
