import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("find")
        .setDescription("Find money"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let places = await client.getLocale(interaction.user.id, "commands.currency.find.places");
        let beg = await client.eco.beg({ user: interaction.user.id, minAmount: 5, maxAmount: 10 });
        if (beg.error) return interaction.reply(await client.getLocale(interaction.user.id, "commands.currency.find.error", places));
        else return interaction.reply(`**${places[Math.floor(Math.random() * places.length)]}** was somewhat profitable, you found **${beg.amount}** 💸.`);
    }
}