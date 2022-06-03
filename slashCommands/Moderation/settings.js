"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("settings")
        .setDescription("View and edit your settings.")
        .addSubcommand(subcommand => subcommand
        .setName("badwords")
        .setDescription("bad words")
        .addStringOption(option => option
        .setName("preset")
        .setDescription("The preset to use.")
        .setRequired(true)
        .addChoices({ name: "Low (only racism and other stuff, default)", value: "low" }, { name: "Medium (curse words other than f and s and other stuff, recommended)", value: "medium" }, { name: "High (most curse words, not recommended)", value: "high" }, { name: "Highest (all curse words)", value: "highest" }, { name: "Custom", value: "custom" }))
        .addStringOption(option => option
        .setName("custom")
        .setDescription("The custom bad words to use, seperate with commas.")
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand
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
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand
        .setName("tags")
        .setDescription("Tags")
        .addStringOption(option => option
        .setName("action")
        .setDescription("The action to perform")
        .addChoices({ name: "add", value: "add" }, { name: "remove", value: "remove" })
        .setRequired(true))
        .addStringOption(option => option
        .setName("tag")
        .setDescription("The tag to add")
        .setRequired(true))
        .addStringOption(option => option
        .setName("customid")
        .setDescription("The value of the tag in the options")
        .setRequired(true))
        .addStringOption(option => option
        .setName("value")
        .setDescription("The value of the tag to send"))),
    category: "Moderation",
    permissions: "MANAGE_GUILD",
    execute(interaction, client, footers) {
        require("./" + interaction.options.getSubcommand()).execute(interaction, client, footers);
    }
};
