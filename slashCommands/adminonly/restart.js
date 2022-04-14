const { SlashCommandBuilder } = require("@discordjs/builders");
const { admins } = require("../../config.json")
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Restarts the bot."),
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    execute(interaction, client) {
        if (!admins.includes(interaction.user.id)) return;
        interaction.reply("Resetting...");
        client.destroy();
        client.login(token);
    }
}