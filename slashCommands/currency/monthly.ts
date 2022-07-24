import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("monthly")
        .setDescription("Get your monthly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        let amount = Math.floor(Math.random() * 500) + 1000;
        let addMoney = await client.eco.monthly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.cooldown", client.getLocale(interaction, "commands.currency.rewards.monthly"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.success", amount, client.getLocale(interaction, "commands.currency.rewards.monthly"), addMoney.rawData.wallet));
    }
}