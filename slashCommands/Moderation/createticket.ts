import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildChannel, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createticket")
        .setDescription("Create a ticket panel.")
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
        ) as SlashCommandBuilder,
    permissions: 'ADMINISTRATOR',
    category: "Moderation",
    guildOnly: true,
    async execute(interaction, client, footers) {
        await interaction.deferReply({ ephemeral: true });
        let title = interaction.options.getString("name");
        let description = interaction.options.getString("description");
        let channel = interaction.options.getChannel("channel");
        let category = interaction.options.getChannel("category");
        let closecategory = interaction.options.getChannel("closecategory");
        if (!title) return interaction.editReply(client.getLocale(interaction, "commands.moderation.createticket.noName"));
        if (!description) return interaction.editReply(client.getLocale(interaction, "commands.moderation.createticket.noDesc"));
        if (category?.type !== "GUILD_CATEGORY" || closecategory?.type !== "GUILD_CATEGORY" || !category || !closecategory) {
            return interaction.editReply(client.getLocale(interaction, "commands.moderation.createticket.categoryNotCategory"));
        }
        if (!(channel instanceof GuildChannel)) channel = await interaction.guild!.channels.fetch(channel!.id)
        if (!channel?.isText()) return interaction.editReply("The channel must be a guild channel.");
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
        category.permissionOverwrites.create(interaction.guild!.id, {
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
            guildId: interaction.guild!.id,
            messageId: message.id,
        });
        ticket.save()
            .then(() => {
                interaction.editReply({ content: `Ticket created successfully!` });
            }
            ).catch((err: any) => {
                console.warn(err);
                interaction.editReply({ content: `There was an error while creating the ticket: ${err}` });
            }
            );
    }
} as SlashCommand;