import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn money!"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        let result = await client.eco.work({
            user: interaction.guild?.id,
            maxAmount: 100,
            replies: client.getLocale(interaction.user.id, "commands.currency.work.users"),
            cooldown: 25
        });
        if (result.error) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.work.cooldown", result.time));
        else interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.work.success", result.workType, result.amount));
    }
} as SlashCommand;