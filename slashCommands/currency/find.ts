import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("find")
        .setDescription("Find money"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        let places = client.getLocale(interaction.user.id, "commands.currency.find.places");
        let beg = await client.eco.beg({ user: interaction.user.id, minAmount: 5, maxAmount: 10 });
        if (beg.error) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.find.error", places));
        else return interaction.editReply(`**${places[Math.floor(Math.random() * places.length)]}** was somewhat profitable, you found **${beg.amount}** 💸.`);
    }
}