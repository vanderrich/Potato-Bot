import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for money!"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        let users = await client.getLocale(interaction.user.id, "commands.currency.beg.users");
        let result = await client.eco.beg({ user: interaction.user.id, minAmount: 1, maxAmount: 5 })
        if (result.error) return interaction.editReply(await client.getLocale(interaction.user.id, "commands.currency.beg.cooldown"));
        return interaction.editReply(await client.getLocale(interaction.user.id, "commands.currency.beg.success", users[Math.floor(Math.random() * users.length)], result.amount));
    }
}