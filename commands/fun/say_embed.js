module.exports= {
  name: 'sayembed',
  description: 'say something embed',
  usage: '<title, description>',
  execute(message, args, cmd, client, Discord) {
    if(args[0] == null){
      message.channel.send('you didnt input any arguments!')
      return;
    }
    args = args.join(' ')
    var title = args.slice(0, args.search(","))
    var description = args.slice(args.search(",")+1)
    
    console.log(title, description)

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(title)
      .setDescription(description)
    console.log(embed)
    message.channel.send(embed)
    message.delete()
  }
}