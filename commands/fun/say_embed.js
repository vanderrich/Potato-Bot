module.exports= {
  name: 'sayembed',
  description: 'say something embed',
  usage: '<title, description>',
  category: "Fun",
  execute(message, args, cmd, client, Discord, footers) {
    if(args[0] == null){
      message.reply('you didnt input any arguments!')
      return;
    }
    args = args.join(' ')
    var title = args.slice(0, args.search(","))
    var description = args.slice(args.search(",")+1)


    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
    message.reply({ embeds: [embed] })
    message.delete()
  }
}