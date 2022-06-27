import { ButtonInteraction, Message } from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "delete-ticket",
    async execute(interaction: ButtonInteraction, client: Client) {
        const locale = client.getLocale(interaction, "commands.moderation.createticket")
        const ticket = interaction.customId.split("-")[2];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!ticketInfo) return interaction.reply(locale.noTicket);
        let message = interaction.message;
        if (!(message instanceof Message)) message = await interaction.channel!.messages.fetch(message.id);
        ticketInfo.updateOne({ $pull: { channelId: interaction.channel?.id } });
        await message.delete();
        await interaction.channel?.delete();
        return interaction.reply(locale.deleteSuccess);
    }
}