const { SlashCommandBuilder } = require("@discordjs/builders");

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
    async execute(interaction, client, Discord, footers) {
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");
        const price = interaction.options.getNumber("price");

        if (price < 1) return interaction.channel.send("You can't add an item for less than 1$!");
        let result = await client.eco.addItem({
            guild: interaction.guild.id,
            inventory: {
                name: name,
                price: price,
                description: description
            }
        });
        if (result.error) {
            if (result.type == 'No-Inventory-Name') return interaction.channel.send('Enter item name to add!')
            if (result.type == 'Invalid-Inventory-Price') return interaction.channel.send('Invalid price!')
            if (result.type == 'No-Inventory-Price') return interaction.channel.send('You didnt specify the price!')
            if (result.type == 'No-Inventory') return interaction.channel.send('No data received!')
        } else return interaction.channel.send('Successfully added `' + name + '` to the shop!')
    }
}