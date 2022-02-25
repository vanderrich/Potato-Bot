const Discord = require('discord.js')
module.exports = {
  name: "kick",
  permissions: "KICK_MEMBERS",
  description: "this command kicks a member",
  category: "Moderation",
  execute(message, args) {
    //initialize
    var muteChannel = message.guild.channels.cache.find(channel => channel.name.includes("modlogs"));
    var muteUser = message.mentions.members.first();
    var muteReason = args[0];
    
    //conditions
    if (!muteUser) return message.channel.send("You have to mention a valid member");
    if (!muteChannel) return message.channel.send("There's no channel called modlogs");
    if (muteReason == muteUser){muteReason = "No reason given";}

    //kick
    var kickEmbed = new Discord.MessageEmbed() 
      .setTitle("Kick")
      .addField("Kicked user", muteUser)
      .addField("Reason", muteReason)
      .setFooter(`Kicked by ${message.author.tag}`)
      .setTimestamp();
    muteUser.kick();
    message.guild.channels.cache.find(channel => channel.name.includes("modlogs")).send(kickEmbed);
  }
}