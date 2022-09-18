import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("daily")
        .setDescription("Get your daily reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction, client) {
        await interaction.deferReply();
        let amount = Math.floor(Math.random() * 50) + 10;
        let addMoney = await client.eco.daily({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.cooldown", client.getLocale(interaction, "commands.currency.rewards.daily"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.success", amount, client.getLocale(interaction, "commands.currency.rewards.daily"), addMoney.rawData.wallet));
    }
} as SlashCommand;