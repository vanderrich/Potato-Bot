const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suicide")
        .setDescription("suicide"),
    category: "Fun",
    execute(interaction) {
        interaction.reply("https://tenor.com/view/suicide-gif-14427950");
        interaction.channel.send("jokes aside, please go to http://www.suicide.org/");
    }
}