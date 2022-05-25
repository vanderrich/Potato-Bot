const { welcomeMessages, footers } = require('../config.json')
const Discord = require("discord.js")
module.exports = {
    name: 'guildMemberAdd',
    async execute(newMember, client) {
        const guildSettings = await client.guildSettings.findOne({ guildId: newMember.guild.id })
        console.log(guildSettings)
        const welcomeChannel = newMember.guild.channels.cache.get(guildSettings?.welcomeChannel) || newMember.guild.channels.cache.find(channel => channel.name.includes('welcome')) || newMember.guild.channels.cache.find(channel => channel.name.includes('general'))
        if (newMember.bot || !welcomeChannel) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(guildSettings?.welcomeMessage || 'New Member!')
            .setDescription(`${newMember.user}`)
            .setThumbnail(newMember.user.avatarURL())
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: newMember.user.avatarURL({ dynamic: true }) })

        welcomeChannel.send({ embeds: [embed] })
        if (guildSettings?.welcomeRole) {
            const role = newMember.guild.roles.cache.get(guildSettings.welcomeRole)
            if (role == undefined) return;

            newMember.roles.add(role)
        }
    }
}