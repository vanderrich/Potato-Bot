import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addshopitem")
        .setDescription("Add a shop item.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the item.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("description")
            .setDescription("The description of the item.")
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("price")
            .setDescription("The price of the item.")
            .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Currency",
    permissions: "ADMINISTRATOR",
    guildOnly: true,
    async execute(interaction, client) {
        await interaction.deferReply();
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");
        const price = interaction.options.getNumber("price");

        if (!price) return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.noPrice"));
        let result = await client.eco.addItem({
            guild: interaction.guild!.id,
            inventory: {
                name: name,
                price: price,
                description: description
            }
        });
        client.updateCache();
        if (result.error) {
            if (result.type == 'No-Inventory-Name') return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.noItemName"));
            if (result.type == 'Invalid-Inventory-Price') return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.invalidPrice"));
            if (result.type == 'No-Inventory-Price') return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.noInvPrice"));
            if (result.type == 'No-Inventory') return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.noInv"));
        } else return interaction.editReply(client.getLocale(interaction, "currency.addshopitem.success", name));
    }
} as SlashCommand;