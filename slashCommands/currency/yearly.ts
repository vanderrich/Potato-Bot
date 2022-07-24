import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("yearly")
        .setDescription("Get your yearly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        let amount = Math.floor(Math.random() * 6000) + 12000;
        let addMoney = await client.eco.yearly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.cooldown", client.getLocale(interaction, "commands.currency.rewards.yearly"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.success", amount, client.getLocale(interaction, "commands.currency.rewards.yearly"), addMoney.rawData.wallet));
    }
}