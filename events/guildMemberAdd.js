const {welcomeMessages} = require('../config.json')
const Discord = require("discord.js")
module.exports = {
  name: 'guildMemberAdd',
  execute(newMember, client) {
    const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name.includes('welcome'))
    if (newMember.bot) return;

    const embed = new Discord.MessageEmbed()
      .setTitle('New Member!')
      .setDescription(`${newMember.user}`)
      .setThumbnail(newMember.user.avatarURL())
      

    welcomeChannel.send({ embeds: [embed] })
  }
}