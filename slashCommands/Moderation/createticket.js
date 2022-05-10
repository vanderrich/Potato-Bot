const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createticket")
        .setDescription("Create a ticket.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the ticket.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("description")
            .setDescription("The description of the ticket.")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to send the ticket to.")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("category")
            .setDescription("The category to put the opened tickets.")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("closecategory")
            .setDescription("The category to put the closed tickets.")
            .setRequired(true)
        ),
    permission: 'MANAGE_MESSAGES',
    category: "Moderation",
    async execute(interaction, client, Discord, footers) {
        let title = interaction.options.getString("name");
        let description = interaction.options.getString("description");
        let channel = interaction.options.getChannel("channel");
        let category = interaction.options.getChannel("category");
        let closecategory = interaction.options.getChannel("closecategory");
        if (category.type !== "GUILD_CATEGORY" || closecategory.type !== "GUILD_CATEGORY") {
            return interaction.reply("The category must be a guild category.");
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        let buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setEmoji("📩")
                    .setCustomId(`ticket-${title}`)
                    .setStyle("PRIMARY"),
                new Discord.MessageButton()
                    .setEmoji("⛔")
                    .setCustomId(`delete-ticket-type-${title}`)
                    .setStyle("DANGER")
            );

        let message = await channel.send({ embeds: [embed], components: [buttons] });
        let ticket = new client.tickets({
            title: title,
            description: description,
            categoryId: category.id,
            closedCategoryId: closecategory.id,
            guildId: interaction.guild.id,
            messageId: message.id,
        });
        ticket.save()
            .then(() => {
                interaction.reply({ content: `Ticket created successfully!`, ephemeral: true });
            }
            ).catch(err => {
                console.log(err);
                interaction.reply({ content: `There was an error while creating the ticket: ${err}`, ephemeral: true });
            }
            );
    }
}