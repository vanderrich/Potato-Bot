import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("weekly")
        .setDescription("Get your weekly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        let amount = Math.floor(Math.random() * 100) + 50;
        let addMoney = await client.eco.weekly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.rewards.cooldown", client.getLocale(interaction.user.id, "commands.currency.rewards.weekly"), addMoney.time));
        else return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.rewards.success", amount, addMoney.rawData.wallet));
    }
}