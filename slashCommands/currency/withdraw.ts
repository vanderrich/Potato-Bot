import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Deposit money into your bank account.")
        .addNumberOption((option: SlashCommandNumberOption) =>
            option
                .setName("amount")
                .setDescription("The amount to withdraw.")
                .setRequired(true)
        ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let money = interaction.options.getNumber("amount");
        let result = await client.eco.withdraw({
            user: interaction.user.id,
            amount: money
        });
        if (result.error) {
            if (result.type === 'money') return interaction.reply("Specify an amount to withdraw");
            if (result.type === 'negative-money') return interaction.reply("Amount must be positive");
            if (result.type === 'low-money') return interaction.reply("You don't have that much money in your bank.");
            if (result.type === 'bank-full') return interaction.reply("Your bank is empty.");
        } else {
            if (result.type === 'all-success') return interaction.reply("You have withdrawn all your money to your bank" + `\nNow you have **$${result.rawData.wallet}** in your wallet and **$${result.rawData.bank}** in your bank.`);
            if (result.type === 'success') return interaction.reply(`You have withdrawn **$${result.amount}** to your bank.\nNow you have **$${result.rawData.wallet}** in your wallet and **$${result.rawData.bank}** in your bank.`);
        };
    }
}
