const Discord = require('discord.js')
module.exports = {
  name: 'suggest',
  description: 'suggest',
  usage: '<suggestion>',
  execute(message, args){
    if(args == []){
      message.reply("you didn\'t provide any args");
      return;
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`New Suggestion`)
      .setDescription(args.join(' '))
    message.guild.channels.cache.find(channel => channel.name.includes("suggest")).send(embed);
  }
}