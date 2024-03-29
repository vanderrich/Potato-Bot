import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn money!"),
    category: "Currency",
    async execute(interaction, client) {
        await interaction.deferReply();
        const result = await client.eco.work({
            user: interaction.guild?.id,
            maxAmount: 100,
            replies: client.getLocale(interaction, "commands.currency.work.users"),
            cooldown: 25
        });
        if (result.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.work.cooldown", result.time));
        else interaction.editReply(client.getLocale(interaction, "commands.currency.work.success", result.workType, result.amount));
    }
} as SlashCommand;