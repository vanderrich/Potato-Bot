import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer money to another user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user you want to transfer to")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of money you want to transfer")
                .setRequired(true)
    ) as SlashCommandBuilder,
    category: "Currency",
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        let user = interaction.options.getUser("user");
        if (!user) return interaction.editReply(client.getLocale(interaction, "commands.currency.transfer.invalidUser"));
        if (user == interaction.user) return interaction.editReply(client.getLocale(interaction, "commands.currency.transfer.sendToSelf"));
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.editReply(client.getLocale(interaction, "commands.currency.transfer.invalidAmount"));
        let result = await client.eco.transferMoney({ user: interaction.user.id, user2: user.id, amount });
        if (result.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.transfer.lowAmount"));
        return interaction.editReply(client.getLocale(interaction, "commands.currency.transfer.success", user.username, amount));
    }
} as SlashCommand;