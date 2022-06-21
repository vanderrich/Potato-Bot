import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for money!"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        let users = client.getLocale(interaction.user.id, "commands.currency.beg.users");
        let result = await client.eco.beg({ user: interaction.user.id, minAmount: 1, maxAmount: 5 })
        if (result.error) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.beg.cooldown"));
        return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.beg.success", users[Math.floor(Math.random() * users.length)], result.amount));
    }
} as SlashCommand;