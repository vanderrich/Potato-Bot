const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest to a channel")
    .addStringOption(option =>
      option
        .setName("suggestion")
        .setDescription("The suggestion")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("The channel to send the suggestion in")
        .setRequired(true)
    ),

  async execute(interaction, client, Discord, footers) {
    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`New Suggestion`)
      .setDescription(interaction.options.getString("suggestion"))
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: message.author.avatarURL({ dynamic: true }) })
    let channel = interaction.options.getChannel("channel");
    channel.send({ embeds: [embed] });
  }
}