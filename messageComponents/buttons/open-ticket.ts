import Discord from "discord.js";
import { Createticket } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    name: "open-ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const locale = client.getLocale(interaction, "commands.moderation.createticket") as Createticket;
        const ticket = interaction.customId.split("-")[2];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        let member = interaction.member
        if (!(member instanceof Discord.GuildMember)) member = await interaction.guild!.members.cache.get(interaction.user.id)!
        if (!ticketInfo) return interaction.reply(locale.noTicket);
        if (interaction.channel?.type !== "GUILD_TEXT") return;
        const category = client.guilds.cache.get(interaction.guildId!)?.channels.cache.get(ticketInfo.categoryId);
        if (!category || category.type !== "GUILD_CATEGORY") return interaction.reply(locale.noCategory);
        interaction.channel.setParent(category);
        await interaction.channel.edit({ name: `${ticketInfo.title}-ticket-${ticketInfo.id}` });
        interaction.channel.permissionOverwrites.set(
            [
                {
                    id: member,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: interaction.guild!.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: client.user!,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                }])
        interaction.reply({ content: locale.openSuccess, ephemeral: true });
        interaction.channel.send({ content: client.getLocale(interaction, "commands.moderation.createticket.openSuccess", interaction.user.toString()) });
    }
}