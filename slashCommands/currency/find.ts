import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("find")
        .setDescription("Find some cash in places"),
    category: "Currency",
    async execute(interaction, client) {
        await interaction.deferReply();
        const places = client.getLocale(interaction, "commands.currency.find.places");
        const beg = await client.eco.beg({ user: interaction.user.id, minAmount: 5, maxAmount: 10 });
        if (beg.error) return interaction.editReply(client.getLocale(interaction, "commands.currency.find.cooldown", beg.time));
        else return interaction.editReply(client.getLocale(interaction, "commands.currency.find.success", places[Math.floor(Math.random() * places.length)], beg.amount));
    }
} as SlashCommand;