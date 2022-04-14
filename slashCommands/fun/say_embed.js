const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say_embed")
    .setDescription("Make the bot send an embed")
    .addStringOption(option =>
      option
        .setName("title")
        .setDescription("The title of the embed")
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName("description")
        .setDescription("The description of the embed"),
  ),
  category: "Fun",
  execute(interaction, client, Discord, footers) {
    var title = interaction.options.getString("title");
    var description = interaction.options.getString("description");

    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
    interaction.reply({ embeds: [embed] })
  }
}