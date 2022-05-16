const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .addNumberOption(option =>
            option
                .setName("item")
                .setDescription("The ID of the item you want to buy.")
    )
        .addBooleanOption(option =>
            option
                .setName("local")
                .setDescription("Whether or not the item is local.")
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to buy.")
    ),
    category: "Currency",
    async execute(interaction, client, Discord, footers) {
        let item = interaction.options.getNumber("item");
        let local = interaction.options.getBoolean("local");

        if (!item) {
            let items = await client.eco.getShopItems(local ? { guild: interaction.guild.id } : { user: interaction.user.id });
            let inv = items.inventory;

            let embed = new Discord.MessageEmbed()
                .setTitle("Store")
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })

            for (let key in inv) {
                embed.addField(`${parseInt(key) + 1} - Price: $${inv[key].price} - **${inv[key].name}:**`, inv[key].description)
            }
            return interaction.reply({ embeds: [embed] });
        }
        interaction.deferReply();
        let result = await client.eco.addUserItem({
            user: interaction.user.id,
            guild: local ? interaction.guild.id : undefined,
            item
        });
        console.log(result);
        if (result.error) {
            if (result.type === 'No-Item') return interaction.editReply('Please provide valid item number');
            if (result.type === 'Invalid-Item') return interaction.editReply('Item does not exist');
            if (result.type === 'low-money') return interaction.editReply(`You're too broke to buy this item.`);
        } else return interaction.editReply(`Successfully bought **${result.inventory.name}** for $${result.inventory.price}`)
    }
}