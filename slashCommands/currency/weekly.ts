import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("weekly")
        .setDescription("Get your weekly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction, client) {
        await interaction.deferReply();
        const amount = Math.floor(Math.random() * 100) + 50;
        const addMoney = await client.eco.weekly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.cooldown", client.getLocale(interaction, "commands.currency.rewards.weekly"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.success", amount, client.getLocale(interaction, "commands.currency.rewards.weekly"), addMoney.rawData.wallet));
    }
} as SlashCommand;