import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money into your bank account.")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to deposit.")
                .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Currency",
    async execute(interaction, client) {
        await interaction.deferReply();
        const money = interaction.options.getNumber("amount");
        const result = await client.eco.deposite({
            user: interaction.user.id,
            amount: money
        });
        if (result.error) {
            if (result.type === 'money') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.money"));
            if (result.type === 'negative-money') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.negativeMoney"));
            if (result.type === 'low-money') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.lowMoney"));
            if (result.type === 'no-money') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.noMoney"));
            if (result.type === 'bank-full') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.bankFull"));
        } else {
            if (result.type === 'all-success') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.allSuccess", result.rawData.bank));
            if (result.type === 'success') return interaction.editReply(client.getLocale(interaction, "commands.currency.deposit.success", money, result.rawData.bank));
        }
    }
} as SlashCommand;