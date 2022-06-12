import { ButtonInteraction, Message } from "discord.js";

module.exports = {
    name: "delete-ticket",
    async execute(interaction: ButtonInteraction, client: any) {
        const ticket = interaction.customId.split("-")[2];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!ticketInfo) return interaction.reply("Ticket not found!");
        if (!(interaction.message instanceof Message)) return
        ticketInfo.updateOne({ $pull: { channelId: interaction.channel?.id } });
        interaction.reply("Deleted Ticket Successfully");
        await interaction.message.delete();
        await interaction.channel?.delete();
    }
}