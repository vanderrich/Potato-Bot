import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const locale = client.getLocale(interaction, "commands.moderation.createticket")
        const ticket = interaction.customId.split("-")[1];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!ticketInfo) return interaction.reply(locale.noTicket);
        const embed = new Discord.MessageEmbed()
            .setTitle(client.getLocale(interaction, "commands.moderation.createticket.ticketTitle", ticketInfo.title))
            .setDescription(locale.ticketDesc)
            .setColor('RANDOM')
        const guild = client.guilds.cache.get(ticketInfo.guildId);
        const category = guild?.channels.cache.get(ticketInfo.categoryId)!;
        if (!category || category.type !== "GUILD_CATEGORY") return interaction.reply(locale.noCategory);
        let member = interaction.member
        if (!(member instanceof Discord.GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id)
        const channel = await category.createChannel(`${ticketInfo.title}-ticket-${ticketInfo.id}`, {
            permissionOverwrites: [
                {
                    id: member,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: guild!.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: client.user!,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                }
            ]
        })
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setEmoji("🔒")
                    .setStyle('SECONDARY')
                    .setCustomId(`close-ticket-notsure-${ticketInfo.title.toLocaleLowerCase().trim()}`)
            );
        await ticketInfo.updateOne({ $set: { channelId: channel.id } });
        await channel.send({ embeds: [embed], content: client.getLocale(interaction, "commands.moderation.createticket.ticketMsg", interaction.user.toString(), ticketInfo.title), components: [row] })
        return interaction.reply({ content: locale.openSuccess, ephemeral: true });
    }
}