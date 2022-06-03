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
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption(option => option
        .setName("target")
        .setDescription("The userID to unban.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("reason")
        .setDescription("The reason for the unban.")
        .setRequired(false)),
    permissions: 'BAN_MEMBERS',
    category: "Moderation",
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return interaction.reply("This command can only be used in a guild.");
            //initialize
            const user = interaction.options.getString("target");
            const reason = interaction.options.getString("reason") || "No reason provided.";
            const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
            //conditions
            if (!channel || channel.type !== "GUILD_TEXT")
                return interaction.reply("Could not find a mod channel!");
            if (!user)
                return interaction.reply("Please provide a userID to unban.");
            //kick
            const banEmbed = new discord_js_1.MessageEmbed()
                .setTitle("Unban")
                .addField("Unbanned user", `<@${user}>`)
                .addField("Reason", reason)
                .setFooter({ text: `Unbanned by ${interaction.user.tag}` })
                .setTimestamp();
            (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.unban(user);
            channel.send({ embeds: [banEmbed] });
        });
    }
};
