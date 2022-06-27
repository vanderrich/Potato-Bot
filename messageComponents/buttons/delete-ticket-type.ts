import { ButtonInteraction, Message } from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "delete-ticket-type",
    permissions: "ADMINISTRATOR",
    async execute(interaction: ButtonInteraction, client: Client) {
        const ticket = interaction.customId.split("-")[3]
        let message = interaction.message
        if (!(message instanceof Message)) message = await interaction.channel!.messages.fetch(message.id)
        await message.delete();
        await client.tickets.deleteOne({ title: ticket });
        interaction.reply({ content: client.getLocale(interaction, "commands.moderation.createticket.deleteSuccess"), ephemeral: true });
    }
}