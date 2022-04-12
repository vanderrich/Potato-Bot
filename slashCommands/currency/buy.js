const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("The item to buy.")
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to buy.")
        ),
    async execute(interaction, client, Discord, footers) {
        let item = interaction.options.getString("item");
        if (!item) {
            let items = Object.keys(client.shop);
            let content = "";

            for (var i in items) {
                content += `${items[i]} - :dollar: ${client.shop[items[i]].cost}\n`
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("Store")
                .setDescription(content)
                .setColor("BLURPLE")
                .setFooter({ text: "Use potat buy <item> [amount] to buy an item!" })
            return interaction.reply({ embeds: [embed] });
        }

        let userBalance = await client.eco.fetchMoney(interaction.user.id);
        let hasItem = client.shop[item.toLowerCase()];
        if (!hasItem || hasItem == undefined) return interaction.reply("That item doesn't exist");
        let amount = interaction.options.getInteger("amount");
        if (!amount) amount = 1;
        let isBalanceEnough = (userBalance >= hasItem.cost * amount);
        if (!isBalanceEnough) return interaction.reply("Your balance is insufficient. You need :dollar: " + hasItem.cost * amount + " to buy this item.");
        client.eco.subtractMoney(interaction.user.id, false, hasItem.cost * amount);

        let itemStruct = {
            name: item.toLowerCase(),
            price: hasItem.cost
        };
        if (amount >= 5000) interaction.reply('Purchasing items, this might take a while')
        for (let i = 0; i < amount; i++) {
            client.db.push(`items_${interaction.user.id}`, itemStruct);
        }
        return interaction.reply(`You purchased **${amount} ${item}** for **:dollar: ${hasItem.cost * amount}**.`);
    }
}