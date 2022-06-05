import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("daily")
        .setDescription("Get your daily reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        let amount = Math.floor(Math.random() * 50) + 10;
        let addMoney = await client.eco.daily({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.rewards.cooldown", client.getLocale(interaction.user.id, "commands.currency.rewards.daily"), addMoney.time));
        else return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.rewards.success", amount, addMoney.rawData.wallet));
    }
}