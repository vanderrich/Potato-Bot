const { welcomeMessages, footers } = require('../config.json')
const Discord = require("discord.js")
module.exports = {
  name: 'guildMemberAdd',
  execute(newMember, client) {
    const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name.includes('welcome')) || newMember.guild.channels.cache.find(channel => channel.name.includes('general'))
    if (newMember.bot || !welcomeChannel) return;

    const embed = new Discord.MessageEmbed()
      .setTitle('New Member!')
      .setDescription(`${newMember.user}`)
      .setThumbnail(newMember.user.avatarURL())
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: message.author.avatarURL({ dynamic: true }) })

    welcomeChannel.send({ embeds: [embed] })
    if (client.settings[newMember.guild.id]?.welcomeRole) {
      const role = newMember.guild.roles.cache.find(role => role.name === client.settings[newMember.guild.id].welcomeRole)
      if (role == undefined) return;

      newMember.roles.add(role)
    }
  }
}