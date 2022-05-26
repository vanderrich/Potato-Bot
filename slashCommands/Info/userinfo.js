const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v9');

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
    async execute(interaction, client, Discord, footers) {
        const userMention = interaction.options.getUser('target') || client.users.cache.get(interaction.targetId);

        let userinfo = {};
        userinfo.bot = userMention.bot;
        userinfo.createdate = userMention.createdAt;
        userinfo.discrim = userMention.discriminator;
        userinfo.id = userMention.id;
        userinfo.tag = userMention.tag;
        userinfo.uname = userMention.username;
        userinfo.avatar = userMention.avatarURL();

        var myInfo = new Discord.MessageEmbed()
            .setAuthor({ name: userinfo.uname, iconURL: userinfo.avatar })
            .addField("Bot?", userinfo.bot.toString(), true)
            .addField("Created At", userinfo.createdate.toString(), true)
            .addField("Discriminator", userinfo.discrim, true)
            .addField("Client ID", userinfo.id, true)
            .addField("Client Tag", userinfo.tag, true)
            .addField("Username", userinfo.uname, true)
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTitle("About this user...")
            .setThumbnail(userinfo.avatar)


        interaction.reply({ embeds: [myInfo] });
    },
};