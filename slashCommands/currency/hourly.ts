import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("hourly")
        .setDescription("Get your hourly reward!"),
    category: "Currency",
    async execute(interaction, client) {
        await interaction.deferReply();
        const amount = Math.floor(Math.random() * 2.0833333333333335 + 1.5166666666666667);
        const addMoney = await client.eco.hourly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.cooldown", client.getLocale(interaction, "commands.currency.rewards.hourly"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.success", amount, client.getLocale(interaction, "commands.currency.rewards.hourly"), addMoney.rawData.wallet));
    }
} as SlashCommand;