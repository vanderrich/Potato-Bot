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
        .setName("giverole")
        .setDescription("Give a role to a user")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to give the role to.")
        .setRequired(true))
        .addRoleOption(option => option
        .setName("role")
        .setDescription("The role to give the user.")
        .setRequired(true)),
    permission: 'MANAGE_MEMBERS',
    category: "Moderation",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //variables
            const targetMember = interaction.options.getMember("target");
            const role = interaction.options.getRole("role");
            if (!targetMember || !(targetMember.roles instanceof discord_js_1.GuildMemberRoleManager))
                return interaction.reply("Provide a valid member!");
            if (!role)
                return interaction.reply("Provide a role!");
            if (!interaction.guild)
                return interaction.reply("This command can only be used in a guild.");
            const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
            if (!channel || channel.type !== "GUILD_TEXT")
                return interaction.reply("Could not find a mod channel!");
            //role
            const roleEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Give Role')
                .addField('Role', `${role}`)
                .addField('User', `${targetMember}`)
                .setFooter({ text: `Given by ${interaction.user.tag}` });
            targetMember.roles.add(role.id);
            channel.send({ embeds: [roleEmbed] });
        });
    }
};
