const { SlashCommandBuilder } = require("@discordjs/builders");
const { admins, token } = require("../../config.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Restarts the bot."),
    permissions: "BotAdmin",
    execute(interaction, client) {
        if (!admins.includes(interaction.user.id)) return;
        interaction.reply("Resetting...");
        client.destroy();
        client.login(token);
    }
}