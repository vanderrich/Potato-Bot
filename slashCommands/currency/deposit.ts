import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money into your bank account.")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to deposit.")
                .setRequired(true)
        ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let money = interaction.options.getNumber("amount");
        let result = await client.eco.deposite({
            user: interaction.user.id,
            amount: money
        });
        if (result.error) {
            if (result.type === 'money') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.money"));
            if (result.type === 'negative-money') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.negativeMoney"));
            if (result.type === 'low-money') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.lowMoney"));
            if (result.type === 'no-money') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.noMoney"));
            if (result.type === 'bank-full') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.bankFull"));
        } else {
            if (result.type === 'all-success') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.allSuccess", result.rawData.bank));
            if (result.type === 'success') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.deposit.success", money, result.rawData.bank));
        };
    }
}
