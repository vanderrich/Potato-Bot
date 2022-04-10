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
  execute(interaction, client, Discord, footers) {
    var title = interaction.options.getString("title");
    var description = interaction.options.getString("description");

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
    interaction.reply({ embeds: [embed] })
  }
}