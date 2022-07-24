import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Deposit money into your bank account.")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to withdraw.")
                .setRequired(true)
    ) as SlashCommandBuilder,
    category: "Currency",
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        let money = interaction.options.getNumber("amount");
        let result = await client.eco.withdraw({
            user: interaction.user.id,
            amount: money
        });
        if (result.error) {
            if (result.type === 'money') return interaction.editReply(client.getLocale(interaction, "commands.currency.withdraw.money"));
            if (result.type === 'negative-money') return interaction.editReply(client.getLocale(interaction, "commands.currency.withdraw.negativeMoney"));
            if (result.type === 'low-money') return interaction.editReply(client.getLocale(interaction, "commands.currency.withdraw.lowMoney"));
            if (result.type === 'bank-full') return interaction.editReply(client.getLocale(interaction, "commands.currency.withdraw.bankFull"));
        } else {
            if (result.type === 'all-success') return interaction.editReply(client.getLocale(interaction, "commands.currency.withdraw.allSuccess", result.rawData.bank));
            if (result.type === 'success') return interaction.editReply(client.getLocale(interaction, "commands.currency.withdraw.success", money, result.rawData.bank));
        };
    }
} as SlashCommand;