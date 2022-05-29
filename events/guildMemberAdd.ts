import { footers } from '../config.json'
import Discord from "discord.js"
module.exports = {
    name: 'guildMemberAdd',
    async execute(newMember: Discord.GuildMember, client: any) {
        const guildSettings = await client.guildSettings.findOne({ guildId: newMember.guild.id })
        console.log(guildSettings)
        const welcomeChannel = newMember.guild.channels.cache.get(guildSettings?.welcomeChannel) || newMember.guild.channels.cache.find(channel => channel.name.includes('welcome')) || newMember.guild.channels.cache.find(channel => channel.name.includes('general'))
        if (newMember.user.bot || !welcomeChannel) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(guildSettings?.welcomeMessage || 'New Member!')
            .setDescription(`${newMember.user}`)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: newMember.user.displayAvatarURL({ dynamic: true }) ? newMember.user.displayAvatarURL({ dynamic: true }) : undefined });
        newMember.user.avatarURL() ? embed.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true })) : "";
        if (welcomeChannel.isText()) welcomeChannel.send({ embeds: [embed] })
        if (guildSettings?.welcomeRole) {
            const role = newMember.guild.roles.cache.get(guildSettings.welcomeRole)
            if (role == undefined) return;

            newMember.roles.add(role)
        }
    }
}