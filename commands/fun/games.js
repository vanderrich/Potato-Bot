const Discord = require('discord.js');
const prefix = require('../../config.json')
module.exports = {
  name: 'games',
  description: 'play some games',
  category: "Fun",
  execute(message, args) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Games')
      .addFields(
        { name: 'fast type', value: 'type the provided word as fast as possible' },
        { name: 'tic tac toe', value: 'play tictactoe!', inline: true },
        { name: 'slots', value: 'spin the slots!', inline: true },
        { name: '\u200B', value: '\u200B' }
      )
      .setTimestamp()
      .setFooter(`to play those games do ${prefix} <game>`)
    message.channel.send(exampleEmbed);
  }
}