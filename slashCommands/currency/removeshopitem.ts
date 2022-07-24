import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removevshopitem")
        .setDescription("Remove a shop item.")
        .addNumberOption(option => option
            .setName("itemnumber")
            .setDescription("The shop item number to remove.")
            .setRequired(true)
    ) as SlashCommandBuilder,
    category: "Currency",
    permissions: "ADMINISTRATOR",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: Client) {
        const itemNumber = interaction.options.getNumber("itemnumber");
        await interaction.deferReply();

        let result = await client.eco.removeItem({
            guild: interaction.guildId,
            item: itemNumber
        })
        client.updateCache();
        if (result.error) {
            if (result.type == 'Invalid-Item-Number' || result.type == "Unknown-Item") return interaction.editReply(client.getLocale(interaction, "currency.buy.noItem"));
        } else return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.success", name));
    }
} as SlashCommand;