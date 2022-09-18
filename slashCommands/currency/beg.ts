import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for money!"),
    category: "Currency",
    async execute(interaction, client) {
        await interaction.deferReply();
        let users = client.getLocale(interaction, "commands.currency.beg.users");
        let result = await client.eco.beg({ user: interaction.user.id, minAmount: 1, maxAmount: 5 })
        if (result.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.beg.cooldown"));
        return interaction.editReply(client.getLocale(interaction, "commands.currency.beg.success", users[Math.floor(Math.random() * users.length)], result.amount));
    }
} as SlashCommand;