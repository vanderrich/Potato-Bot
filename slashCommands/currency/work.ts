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
            replies: ['Potato Peeler', 'Janitor', 'Rice Cooker', 'Baker', 'Carpenter', 'Lumberjack', 'Miner', 'Farmer'],
            cooldown: 25
        });
        if (result.error) return interaction.reply(`You're too tired, Try again in ${result.time}`);
        else interaction.reply(`You worked as a ${result.workType} and earned **$${result.amount}**.`)
    }
}