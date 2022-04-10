const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sell")
        .setDescription("Sell an item")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("The item you want to sell")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of items you want to sell")
        ),
    async execute(interaction, client) {
        let item = interaction.options.getString("item");
        let hasItem;
        let inv = client.db.get(`items_${interaction.user.id}`)
        // loop through the inv, if the current item is equal to the item, set hasItem to the current item
        for (let i = 0; i < inv.length; i++) if (inv[i].name == item) hasItem = inv[i]
        if (!hasItem) return interaction.reply("That item doesn't exist");
        let amount = interaction.options.getInteger("amount");
        if (!amount) amount = 1;
        let price;
        for (let i = 0; i < amount; i++) {
            for (let j = 0; j < inv.length; j++) {
                const currItem = inv[j];
                if (currItem.name == item) {
                    const itemInv = currItem;
                    price = itemInv.price || itemInv.prize;
                    await client.eco.addMoney(interaction.user.id, false, price);
                    inv.splice(j, 1)
                    client.db.set(`items_${interaction.user.id}`, inv)
                    break
                }
            }
        }
        return interaction.reply(`You sold **${amount} ${item}** for **:dollar: ${price}**.`);
    }
}