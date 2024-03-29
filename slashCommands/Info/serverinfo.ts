import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { SlashCommand } from "../../Util/types";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Information about the server'),
    category: 'Info',
    guildOnly: true,
    async execute(interaction, client, footers) {
        //variables
        const locales = client.getLocale(interaction, 'commands.info.serverInfo')
        const roles = interaction.guild!.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = interaction.guild!.members.cache;
        const channels = interaction.guild!.channels.cache;
        const emojis = interaction.guild!.emojis.cache;
        const verificationLevels = locales.verificationLevels;
        const filterLevels = locales.filterLevels;

        //embed
        const embed = new MessageEmbed()
            .setDescription(locales.embedTitle)
            .setColor('RANDOM')
            .addFields({
                name: locales.general,
                value: `${locales.name}: ${interaction.guild!.name}
                ${locales.id}: ${interaction.guild!.id}
                ${locales.boostTier}: ${interaction.guild!.premiumTier == 'NONE' ? client.getLocale(interaction, "commands.info.serverinfo.tier", interaction.guild!.premiumTier) : 'None'}
                ${locales.explicitFilter}: ${filterLevels[interaction.guild!.explicitContentFilter]}
                ${locales.verificationLevel}: ${verificationLevels[interaction.guild!.verificationLevel]}
                \n\u200b
            `}, {
                name: locales.statistics,
                value: `${locales.roleCount}: ${roles.length}
                ${locales.emojiCount}: ${emojis.size}
                ${locales.regEmojiCount}: ${emojis.filter(emoji => !emoji.animated).size}
                ${locales.animEmojiCount}: ${emojis.filter(emoji => !(!emoji.animated)).size}
                ${locales.memberCount}: ${interaction.guild!.memberCount}
                ${locales.botCount}: ${members.filter(member => member.user.bot).size}
                ${locales.textChannelCount}: ${channels.filter(channel => channel.isText()).size}
                ${locales.voiceChannelCount}: ${channels.filter(channel => channel.isVoice()).size}
                ${locales.boostCount}: ${interaction.guild!.premiumSubscriptionCount || '0'}
                \u200b
            `}, {
                name: locales.presence,
                value:
                    `${locales.online}: ${members.filter(member => member.presence?.status == 'online').size}
                ${locales.idle}: ${members.filter(member => member.presence?.status == 'idle').size}
                ${locales.dnd}: ${members.filter(member => member.presence?.status == 'dnd').size}
                ${locales.offline}: ${members.filter(member => member.presence == null).size}
                \u200b
            `}, {
                name: client.getLocale(interaction, "commands.info.serverInfo.roles", roles.length - 1),
                value: roles.join(', ')
            })
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.editReply({ embeds: [embed] });
    }
} as SlashCommand;