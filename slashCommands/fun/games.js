const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("games")
    .setDescription("A list of games you can play"),
  execute(message, client, Discord, footers) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Games')
      .addFields(
        { name: 'fast type', value: 'type the provided word as fast as possible' },
        { name: 'tic tac toe', value: 'play tictactoe!', inline: true },
        { name: 'slots', value: 'spin the slots!', inline: true },
        { name: '\u200B', value: '\u200B' }
      )
      .setTimestamp()
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: message.author.avatarURL({ dynamic: true }) });
    message.reply({ embeds: [exampleEmbed] });
  }
}