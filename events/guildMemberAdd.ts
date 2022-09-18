import { en } from '../localization.json';
import Discord from "discord.js"
import { Client, Event } from '../Util/types'
const footers = en.utils.footers

module.exports = {
    name: 'guildMemberAdd',
    async execute(newMember: Discord.GuildMember, client: Client) {
        const guildSettings = await client.guildSettings.findOne({ guildId: newMember.guild.id })
        const welcomeChannel = newMember.guild.channels.cache.get(guildSettings?.welcomeChannel!);
        if (newMember.user.bot || !welcomeChannel) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(guildSettings?.welcomeMessage || 'New Member!')
            .setDescription(`${newMember.user}`)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: newMember.user.displayAvatarURL({ dynamic: true }) ? newMember.user.displayAvatarURL({ dynamic: true }) : undefined });
        newMember.user.avatarURL() ? embed.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true })) : "";
        if (welcomeChannel.isText() && newMember.guild.me && welcomeChannel.permissionsFor(newMember.guild!.me).has("SEND_MESSAGES") && welcomeChannel.permissionsFor(newMember.guild!.me).has("VIEW_CHANNEL")) welcomeChannel.send({ embeds: [embed] })
        if (guildSettings?.welcomeRole) {
            const role = newMember.guild.roles.cache.get(guildSettings.welcomeRole)
            if (role == undefined) return;

            newMember.roles.add(role)
        }
    }
} as Event;