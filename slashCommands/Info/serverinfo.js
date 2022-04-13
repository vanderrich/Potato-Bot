const { SlashCommandBuilder } = require('@discordjs/builders');

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
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Information about the server'),
    async execute(interaction, client, Discord, footers) {
        //variables
        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = interaction.guild.members.cache;
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache;

        //embed
        const embed = new Discord.MessageEmbed()
            .setDescription(`**Server Info**`)
            .setColor('RANDOM')
            .addField('General', `
                **Name:** ${interaction.guild.name}
                **ID:** ${interaction.guild.id}
                **Region:** ${regions[interaction.guild.region]}
                **Boost Tier:** ${interaction.guild.premiumTier == 'NONE' ? `Tier ${interaction.guild.premiumTier}` : 'None'}
                **Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}
                **Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}
                \n\u200b
            `)
            .addField('Statistics', `
                **Role Count:** ${roles.length}
                **Emoji Count:** ${emojis.size}
                **Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
                **Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}
                **Member Count:** ${interaction.guild.memberCount}
                **Bots:** ${members.filter(member => member.user.bot).size}
                **Text Channels:** ${channels.filter(channel => channel.type === 'text').size}
                ** Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}
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