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
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to kick.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("reason")
        .setDescription("The reason for the kick.")
        .setRequired(false)),
    permissions: "KICK_MEMBERS",
    category: "Moderation",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //initialize
            if (!interaction.guild)
                return interaction.reply("This command can only be used in a guild.");
            const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
            const member = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "No reason provided.";
            //conditions
            if (!channel || channel.type !== "GUILD_TEXT")
                return interaction.reply("Could not find a mod channel!");
            if (!member || !(member instanceof discord_js_1.GuildMember))
                return interaction.reply("Provide a valid member!");
            //kick
            const kickEmbed = new discord_js_1.MessageEmbed()
                .setTitle("Kick")
                .addField("Kicked user", `${member}`)
                .addField("Reason", `${reason}`)
                .setFooter({ text: `Kicked by ${interaction.user.tag}` })
                .setTimestamp();
            interaction.guild.members.kick(member, reason);
            channel.send({ embeds: [kickEmbed] });
        });
    }
};
