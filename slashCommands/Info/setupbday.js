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
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("setup")
        .setDescription("Setup your birthday channel.")
        .addChannelOption(option => option
        .setName("birthdaychannel")
        .setDescription("The channel to send the birthday messages to."))
        .addRoleOption(option => option
        .setName("birthdayrole")
        .setDescription("The role to give to users whose birthday is today, to ping the user type <@${user.id}>."))
        .addStringOption(option => option
        .setName("birthdaymessage")
        .setDescription("The message to send to users whose birthday is today.")),
    category: "Info",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return interaction.editReply("This command can only be used in a guild!");
            const birthdayRole = interaction.options.getRole("birthdayrole");
            const birthdayChannel = interaction.options.getChannel("birthdaychannel");
            const birthdayMessage = interaction.options.getString("birthdaymessage");
            if (birthdayChannel instanceof discord_js_1.GuildChannel && birthdayChannel)
                if (!birthdayChannel.isText() && birthdayChannel != null)
                    return interaction.reply("That channel is not a text channel!");
            const birthdayConfig = yield client.birthdayConfigs.findOne({ guildId: interaction.guild.id });
            if (birthdayConfig) {
                client.birthdayConfigs.updateOne({ guildId: interaction.guild.id }, { $set: { birthdayChannel: birthdayChannel, birthdayRole: birthdayRole, birthdayMessage: birthdayMessage } });
            }
            else {
                new client.birthdayConfigs({
                    guildId: interaction.guild.id,
                    channelId: birthdayChannel === null || birthdayChannel === void 0 ? void 0 : birthdayChannel.id,
                    roleId: birthdayRole === null || birthdayRole === void 0 ? void 0 : birthdayRole.id,
                    message: birthdayMessage
                }).save();
            }
            interaction.reply("Your birthday data has been set!");
            console.log(`[INFO] ${interaction.user.tag} set their birthday data`);
        });
    }
};
