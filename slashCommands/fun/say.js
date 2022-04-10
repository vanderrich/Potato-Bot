const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("The text you want the bot to say")
        .setRequired(true),
    ),
  execute(interaction) {
    let text = interaction.options.getString("text");
    if (text.length > 2000) return interaction.reply("Your text is too long!");
    interaction.reply(text)
  }
} 