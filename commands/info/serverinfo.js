
const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};

module.exports = {
    name: 'server',
    aliases: ['serverinfo', 'infoserver'],
    description: 'servers info...',
    cooldown: 5,
    guildOnly: true,
    args: false,
    execute(message, args, client, cmd, Discord) {
        //variables
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;
        
        //embed
        const embed = new Discord.MessageEmbed()
            .setDescription(`**Server Info**`)
            .setColor('BLACK')
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('General', [
                `**Name:** ${message.guild.name}`,
                `**ID:** ${message.guild.id}`,
                `**Region:** ${regions[message.guild.region]}`,
                `**Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                `**Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
                `**Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
                '\u200b'
            ])
            .addField('Statistics', [
                `**Role Count:** ${roles.length}`,
                `**Emoji Count:** ${emojis.size}`,
                `**Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
                `**Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
                `**Member Count:** ${message.guild.memberCount}`,
                `**Bots:** ${members.filter(member => member.user.bot).size}`,
                `**Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
                `**Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
                `**Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
                '\u200b'
            ])
            .addField('Presence', [
                `**Online:** ${members.filter(member => member.presence.status === 'online').size}`,
                `**Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
                `**Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
                `**Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
                '\u200b'
            ])
            .addField(`Roles [${roles.length - 1}]`, roles.join(', '))
    
            .setTimestamp();
        message.channel.send({ embeds: [embed] });
    }

}