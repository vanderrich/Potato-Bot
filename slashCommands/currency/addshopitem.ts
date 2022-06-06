import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

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
        ),
    category: "Currency",
    permissions: "ADMINISTRATOR",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");
        const price = interaction.options.getNumber("price");

        if (!price) return interaction.reply(await client.getLocale(interaction.user.id, "currency.addshopitem.noPrice"));
        let result = await client.eco.addItem({
            guild: interaction.guild!.id,
            inventory: {
                name: name,
                price: price,
                description: description
            }
        });
        if (result.error) {
            if (result.type == 'No-Inventory-Name') return interaction.reply(await client.getLocale(interaction.user.id, "currency.addshopitem.noItemName"));
            if (result.type == 'Invalid-Inventory-Price') return interaction.reply(await client.getLocale(interaction.user.id, "currency.addshopitem.invalidPrice"));
            if (result.type == 'No-Inventory-Price') return interaction.reply(await client.getLocale(interaction.user.id, "currency.addshopitem.noInvPrice"));
            if (result.type == 'No-Inventory') return interaction.reply(await client.getLocale(interaction.user.id, "currency.addshopitem.noInv"));
        } else return interaction.reply(await client.getLocale(interaction.user.id, "currency.addshopitem.success", name));
    }
}