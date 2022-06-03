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
        .setName("mute")
        .setDescription("Mute a user")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to mute.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("reason")
        .setDescription("The reason for the mute.")
        .setRequired(false)),
    permissions: 'MANAGE_MESSAGES',
    category: "Moderation",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return interaction.reply("This command can only be used in a guild.");
            //initialize
            const channel = interaction.guild.channels.cache.find(channel => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
            const member = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "No reason given";
            const muteRole = interaction.guild.roles.cache.find(role => role.name.includes("mute"));
            //conditions
            if (!channel || !(channel instanceof discord_js_1.TextChannel))
                return interaction.reply("Could not find a mod channel!");
            if (!member || !(member instanceof discord_js_1.GuildMember))
                return interaction.reply("Provide a valid member!");
            if (!muteRole)
                return interaction.reply("Could not find a mute role!");
            //mute
            const muteEmbed = new discord_js_1.MessageEmbed()
                .setTitle("Mute")
                .addField("Muted user", `${member}`)
                .addField("Reason", `${reason}`)
                .setFooter({ text: `Muted by ${interaction.user.tag}` })
                .setTimestamp();
            member.roles.add(muteRole.id);
            channel.send({ embeds: [muteEmbed] });
        });
    }
};
