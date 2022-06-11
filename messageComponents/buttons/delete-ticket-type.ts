import { ButtonInteraction, Message } from "discord.js";

module.exports = {
    name: "delete-ticket-type",
    async execute(interaction: ButtonInteraction, client: any) {
        if (!interaction.memberPermissions?.has("MANAGE_MESSAGES")) return interaction.reply("You don't have permission to use this command!");
        const ticket = interaction.customId.split("-")[3]
        if (!(interaction.message instanceof Message)) return
        await interaction.message.delete();
        await client.tickets.deleteOne({ title: ticket });
        interaction.reply({ content: "Deleted ticket successfully", ephemeral: true });
    }
}