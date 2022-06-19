import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "open-ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const ticket = interaction.customId.split("-")[2];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!interaction.member || !interaction.guild || !(interaction.member instanceof Discord.GuildMember)) return interaction.reply("you are not in a guild! (no idea how this happened)");
        if (!ticketInfo) return interaction.reply("Ticket not found!");
        if (interaction.channel?.type !== "GUILD_TEXT") return interaction.reply("This command can only be used in a server!");
        const category = client.guilds.cache.get(interaction.guildId!)?.channels.cache.get(ticketInfo.categoryId);
        if (!category || category.type !== "GUILD_CATEGORY") return interaction.reply("Category not found!");
        interaction.channel.setParent(category);
        await interaction.channel.edit({ name: `${ticketInfo.title}-ticket-${ticketInfo.id}` });
        interaction.channel.permissionOverwrites.set(
            [
                {
                    id: interaction.member!,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: client.user!,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                }])
        interaction.reply({ content: "Opened Ticket Successfully", ephemeral: true });
        interaction.channel.send({ content: `Ticket opened by ${interaction.user}` });
    }
}