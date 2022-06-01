import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildChannel, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

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
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        let title = interaction.options.getString("name");
        let description = interaction.options.getString("description");
        let channel = interaction.options.getChannel("channel");
        let category = interaction.options.getChannel("category");
        let closecategory = interaction.options.getChannel("closecategory");
        if (!title) return interaction.reply("Provide a name for the ticket!");
        if (!description) return interaction.reply("Provide a description for the ticket!");
        if (category?.type !== "GUILD_CATEGORY" || closecategory?.type !== "GUILD_CATEGORY" || !category || !closecategory) {
            return interaction.reply("The category must be a guild category.");
        }
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        if (!channel || !(channel instanceof GuildChannel) || !channel.isText()) return interaction.reply("The channel must be a guild channel.");
        let embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        let buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji("📩")
                    .setCustomId(`ticket-${title}`)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setEmoji("⛔")
                    .setCustomId(`delete-ticket-type-${title}`)
                    .setStyle("DANGER")
            );
        category.permissionOverwrites.create(interaction.guild.id, {
            'VIEW_CHANNEL': false,
            'SEND_MESSAGES': false,
            'READ_MESSAGE_HISTORY': false,
            'ADD_REACTIONS': false
        });
        let message = await channel.send({ embeds: [embed], components: [buttons] });
        let ticket = new client.tickets({
            title: title,
            description: description,
            categoryId: category.id,
            closeCategoryId: closecategory.id,
            guildId: interaction.guild.id,
            messageId: message.id,
        });
        ticket.save()
            .then(() => {
                interaction.reply({ content: `Ticket created successfully!`, ephemeral: true });
            }
            ).catch((err: any) => {
                console.log(err);
                interaction.reply({ content: `There was an error while creating the ticket: ${err}`, ephemeral: true });
            }
            );
    }
}