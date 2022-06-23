import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../Util/types';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user to get information about.')
                .setRequired(true)
    ) as SlashCommandBuilder,
    contextMenu: new ContextMenuCommandBuilder()
        .setName('userinfo')
        .setType(ApplicationCommandType.User),
    category: 'Info',
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        const userMention = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
        if (!userMention) return

        let userinfo = {
            bot: userMention.bot,
            createdate: userMention.createdAt,
            discrim: userMention.discriminator,
            id: userMention.id,
            tag: userMention.tag,
            uname: userMention.username,
            avatar: userMention.avatarURL(),
        };

        var myInfo = new MessageEmbed()
            .setAuthor({ name: userinfo.uname, iconURL: userinfo.avatar! })
            .addField("Bot?", userinfo.bot.toString(), true)
            .addField("Created At", userinfo.createdate.toString(), true)
            .addField("Discriminator", userinfo.discrim, true)
            .addField("Client ID", userinfo.id, true)
            .addField("Client Tag", userinfo.tag, true)
            .addField("Username", userinfo.uname, true)
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setTitle("About this user...")

        interaction.reply({ embeds: [myInfo] });
    },
} as SlashCommand;