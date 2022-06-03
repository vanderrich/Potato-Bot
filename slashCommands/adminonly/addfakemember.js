"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("addfakemember")
        .setDescription("Adds a fake member to the server"),
    permissions: 'BotAdmin',
    category: "Bot Admin Only",
    execute: (interaction, client) => {
        if (!interaction.member)
            return interaction.reply("You must be in a guild to use this command.");
        if (!interaction.inCachedGuild())
            return interaction.reply("You must be in a cached guild to use this command.");
        client.emit("guildMemberAdd", interaction.member);
        interaction.reply("Added fake member");
    }
};
