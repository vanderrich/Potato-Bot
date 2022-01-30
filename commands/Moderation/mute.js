const prefix = require('../../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
  name: 'mute',
  description: 'mute someone',
  permissions: 'MANAGE_MESSAGES',
  guildOnly: true,
  execute(message, args){
    //initialize
    var muteRole = message.guild.roles.cache.find(role => role.name.toLowerCase().includes("muted"));
    var muteChannel = message.guild.channels.cache.find(channel => channel.name.includes("modlogs"));
    var muteUser = message.mentions.members.first();
    var muteReason = args[0];
    
    //conditions
    if (!muteUser) return message.channel.send("You have to mention a valid member");
    if (!muteChannel) return message.channel.send("There's no channel called modlogs");
    if (!muteRole) return message.channel.send("There's no role called muted");
    if (muteReason == muteUser) muteReason = "No reason given";
    
    //mute
    var muteEmbed = new Discord.MessageEmbed() 
    .setTitle("Mute")
    .addField("Muted user", muteUser)
    .addField("Reason", muteReason)
    .setFooter(`Muted by ${message.author.tag}`)
    .setTimestamp();
    muteUser.roles.add(muteRole);
    message.channel.send(`${muteUser} has been muted`);
    muteChannel.send(muteEmbed);
  }
}