import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Information about the server'),
    category: 'Info',
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        if (!interaction.guild) return interaction.reply('This command can only be used in a server.');
        //variables
        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = interaction.guild.members.cache;
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache;
        const verificationLevels = client.getLocale(interaction.user.id, 'commands.info.serverinfo.verificationLevels');
        const filterLevels = client.getLocale(interaction.user.id, 'commands.info.serverinfo.filterLevels');

        //embed
        const embed = new MessageEmbed()
            .setDescription(client.getLocale(interaction.user.id, 'commands.info.serverinfo.embedTitle'))
            .setColor('RANDOM')
            .addField('General', `
                **Name:** ${interaction.guild.name}
                **ID:** ${interaction.guild.id}
                **Boost Tier:** ${interaction.guild.premiumTier == 'NONE' ? `Tier ${interaction.guild.premiumTier}` : 'None'}
                **Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}
                **Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}
                \n\u200b
            `)
            .addField('Statistics', `
                **Role Count:** ${roles.length}
                **Emoji Count:** ${emojis.size}
                **Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
                **Animated Emoji Count:** ${emojis.filter(emoji => !(!emoji.animated)).size}
                **Member Count:** ${interaction.guild.memberCount}
                **Bots:** ${members.filter(member => member.user.bot).size}
                **Text Channels:** ${channels.filter(channel => channel.isText()).size}
                ** Voice Channels:** ${channels.filter(channel => channel.isVoice()).size}
                **Boost Count:** ${interaction.guild.premiumSubscriptionCount || '0'}
                \u200b
            `)
            .addField('Presence', `
                **Online:** ${members.filter(member => member.presence?.status == 'online').size}
                **Idle:** ${members.filter(member => member.presence?.status == 'idle').size}
                **Do Not Disturb:** ${members.filter(member => member.presence?.status == 'dnd').size}
                **Offline:** ${members.filter(member => member.presence == null).size}
                \u200b
            `)
            .addField(`Roles [${roles.length - 1}]`, roles.join(', '))
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.reply({ embeds: [embed] });
    }
}