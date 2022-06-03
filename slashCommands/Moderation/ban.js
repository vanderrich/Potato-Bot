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
        .setName("ban")
        .setDescription("Ban a user from the server.")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to ban.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("reason")
        .setDescription("The reason for the ban.")
        .setRequired(false)),
    permissions: 'BAN_MEMBERS',
    category: "Moderation",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return interaction.reply("This command can only be used in a guild.");
            //initialize
            const member = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "No reason provided.";
            const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
            //conditions
            if (!channel || channel.type !== "GUILD_TEXT")
                return interaction.reply("Could not find a mod channel!");
            if (!member || !(member instanceof discord_js_1.GuildMember))
                return interaction.reply("Please provide a user to ban.");
            //ban
            var banEmbed = new discord_js_1.MessageEmbed()
                .setTitle("Ban")
                .addField("Banned user", `<@${member.id}>`)
                .addField("Reason", reason)
                .setFooter({ text: `Banned by ${interaction.user.tag}` })
                .setTimestamp();
            interaction.guild.members.ban(member, { reason: reason });
            channel.send({ embeds: [banEmbed] });
        });
    }
};
