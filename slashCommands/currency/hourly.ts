import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("hourly")
        .setDescription("Get your hourly reward!"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        let amount = Math.floor(Math.random() * 2.0833333333333335 + 1.5166666666666667);
        let addMoney = await client.eco.hourly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.rewards.cooldown", client.getLocale(interaction.user.id, "commands.currency.rewards.hourly"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.rewards.success", amount, addMoney.rawData.wallet));
    }
}