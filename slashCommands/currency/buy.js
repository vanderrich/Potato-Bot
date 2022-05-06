const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .addNumberOption(option =>
            option
                .setName("item")
                .setDescription("The ID of the item you want to buy.")
                .addChoice("laptop", 1)
                .addChoice("potato", 2)
                .addChoice("mop", 3)
                .addChoice("potato peeler", 4)
                .addChoice("water", 5)
                .addChoice("fertilizer", 6)
                .addChoice("potato seeds (large)", 7)
                .addChoice("potato seeds (medium)", 8)
                .addChoice("potato seeds (small)", 9)
                .addChoice("potato seeds (tiny)", 10)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to buy.")
    ),
    category: "Currency",
    async execute(interaction, client, Discord, footers) {
        let item = interaction.options.getNumber("item");

        if (!item) {
            let items = await client.eco.getShopItems({ user: interaction.user.id });
            let inv = items.inventory

            let embed = new Discord.MessageEmbed()
                .setTitle("Store")
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })

            for (let key in inv) {
                embed.addField(`${parseInt(key) + 1} - Price: $${inv[key].price} - **${inv[key].name}:**`, inv[key].description)
            }
            return interaction.reply({ embeds: [embed] });
        }
        let result = await client.eco.addUserItem({
            user: interaction.user.id,
            item
        });
        if (result.error) {
            if (result.type === 'No-Item') return interaction.reply('Please provide valid item number');
            if (result.type === 'Invalid-Item') return interaction.reply('Item does not exist');
            if (result.type === 'low-money') return interaction.reply(`You're too broke to buy this item.`);
        } else return interaction.reply(`Successfully bought **${result.inventory.name}** for $${result.inventory.price}`)
    }
}