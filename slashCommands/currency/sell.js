const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sell")
        .setDescription("Sell an item")
        .addNumberOption(option =>
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
    category: "Currency",
    async execute(interaction, client) {
        let result = await client.eco.removeUserItem({
            user: interaction.user.id,
            item: interaction.options.getNumber("item"),
        });
        if (result.error) {
            if (result.type == 'Invalid-Item-Number') return interaction.reply('Please enter the item number to remove!')
            if (result.type == 'Unknown-Item') return interaction.reply('The item doesn\'t exist!')
        } else interaction.reply('Successfully sold `' + result.inventory.name + '` for ! You now have ' + result.inventory.amount + ' of those items left!')
    }
}