const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suicide")
        .setDescription("Make the bot kill itself :)"),
    execute(interaction) {
        interaction.reply("https://tenor.com/view/suicide-gif-14427950")
    }
}