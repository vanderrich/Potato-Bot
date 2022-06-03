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
        .setName("removerole")
        .setDescription("Remove a role from a user.")
        .addUserOption(option => option
        .setName("target")
        .setDescription("The user to remove the role from.")
        .setRequired(true))
        .addRoleOption(option => option
        .setName("role")
        .setDescription("The role to remove.")
        .setRequired(true)),
    permissions: "MANAGE_ROLES",
    category: "Moderation",
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const targetuser = interaction.options.getMember("target");
            const role = interaction.options.getRole("role");
            const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
            if (!channel || channel.type !== "GUILD_TEXT")
                return interaction.reply("Could not find a mod channel!");
            if (!interaction.guild)
                return interaction.reply("You can't use this command in a DM!");
            if (!targetuser || !(targetuser.roles instanceof discord_js_1.GuildMemberRoleManager))
                return interaction.reply("You must specify a user!");
            if (!role)
                return interaction.reply("You must specify a role!");
            //remove role
            const roleEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Remove Role')
                .addField('Role', `${role}`)
                .addField('User', `${targetuser}`)
                .setFooter({ text: `Removed by ${interaction.user.tag}` });
            targetuser.roles.remove(role.id);
            channel.send({ embeds: [roleEmbed] });
        });
    }
};
