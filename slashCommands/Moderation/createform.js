const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createform')
        .setDescription('Creates a new form')
        .addStringOption(subcommand => subcommand
            .setName('name')
            .setRequired(true)
            .setDescription('The name of the form')
        )
        .addStringOption(subcommand => subcommand
            .setName('description')
            .setRequired(true)
            .setDescription('The description of the form')
        )
        .addChannelOption(subcommand => subcommand
            .setName('channel')
            .setRequired(true)
            .setDescription('The channel to send the form to')
        ),
    permissions: ['MANAGE_GUILD'],
    async execute(interaction, client, Discord, footers) {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        const form = new client.forms({ guildId: guild.id, title: name, description, fields: [] });
        channel.send({
            content: `${name}`,
            components: [
                new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                            .setLabel('Open Form')
                            .setStyle('primary')
                            .setCustomId('form-' + name)
                    ])
            ]
        });
        interaction.reply(`Created form ${form.name}`);
    }
};