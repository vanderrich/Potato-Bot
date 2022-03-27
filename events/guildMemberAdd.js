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
    if (client.settings[newMember.guild.id]?.welcomeRole) {
      const role = newMember.guild.roles.cache.find(role => role.name === client.settings[newMember.guild.id].welcomeRole)
      if (role == undefined) return;

      newMember.roles.add(role)
    }
  }
}