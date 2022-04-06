module.exports = {
  name: 'games',
  description: 'play some games',
  category: "Fun",
  execute(message, args, cmd, client, Discord, footers) {
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
      .setFooter({ text: 'Use potat games <game> to play a game!' });
    message.channel.send({ embeds: [exampleEmbed] });
  }
}