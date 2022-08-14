import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { AllowedImageSize, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Client } from '../../Util/types';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user to get information about.')
                .setRequired(true)
        ),
    contextMenu: new ContextMenuCommandBuilder()
        .setName('userinfo')
        .setType(ApplicationCommandType.User),
    category: 'Info',
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        const userMention = interaction.isContextMenu() ? await client.users.fetch(interaction.targetId) : interaction.options.getUser("target") || interaction.user;
        if (!userMention) return

        let userinfo = {
            bot: userMention.bot,
            createdate: userMention.createdAt,
            discrim: userMention.discriminator,
            id: userMention.id,
            tag: userMention.tag,
            uname: userMention.username,
            avatar: userMention.displayAvatarURL({ dynamic: true })
        };

        var myInfo = new MessageEmbed()
            .setAuthor({ name: userinfo.uname, iconURL: userinfo.avatar })
            .setThumbnail(userinfo.avatar)
            .addFields(
                { name: "Bot?", value: userinfo.bot.toString(), inline: true },
                { name: "Created At", value: userinfo.createdate.toString(), inline: true },
                { name: "Discriminator", value: userinfo.discrim, inline: true },
                { name: "ID", value: userinfo.id, inline: true },
                { name: "Tag", value: userinfo.tag, inline: true },
                { name: "Username", value: userinfo.uname, inline: true }
            )
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setTitle("About this user...")
        const sizes: AllowedImageSize[] = [16, 32, 64, 128, 256, 512, 1024, 2048];
        const actionRows = [];
        const buttons = [];
        for (const size of sizes) {
            const button = new MessageButton();
            button.setStyle('LINK');
            button.setLabel(size.toString());
            button.setURL(userMention.displayAvatarURL({ size }));
            buttons.push(button);
        }
        for (let i = 0; i < buttons.length; i += 3) {
            actionRows.push(new MessageActionRow().addComponents(buttons.slice(i, i + 5)));
        }
        interaction.reply({ embeds: [myInfo], components: actionRows });
    }
}