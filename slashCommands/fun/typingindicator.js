const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("typingindicator")
        .setDescription("Make the bot send a typing indicator"),
    category: "Fun",
    execute(interaction) {
        interaction.channel.sendTyping();
    }
}