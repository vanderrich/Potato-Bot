import { CommandInteraction, MessageEmbed } from "discord.js";
import { jobsEmbed, footers } from "../../config.json";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn money!"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let result = await client.eco.work({
            user: interaction.guild?.id,
            maxAmount: 100,
            replies: await client.getLocale(interaction.user.id, "commands.currency.work.users"),
            cooldown: 25
        });
        if (result.error) return interaction.reply(await client.getLocale(interaction.user.id, "commands.currency.work.cooldown", result.time));
        else interaction.reply(await client.getLocale(interaction.user.id, "commands.currency.work.success", result.workType, result.amount));
    }
}