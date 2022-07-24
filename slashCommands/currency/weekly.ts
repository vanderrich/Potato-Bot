import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("weekly")
        .setDescription("Get your weekly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        let amount = Math.floor(Math.random() * 100) + 50;
        let addMoney = await client.eco.weekly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.cooldown", client.getLocale(interaction, "commands.currency.rewards.weekly"), addMoney.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.rewards.success", amount, client.getLocale(interaction, "commands.currency.rewards.weekly"), addMoney.rawData.wallet));
    }
} as SlashCommand;