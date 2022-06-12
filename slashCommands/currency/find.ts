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
        if (beg.error) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.find.cooldown", beg.time));
        else return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.find.success", places[Math.floor(Math.random() * places.length)], beg.amount));
    }
}