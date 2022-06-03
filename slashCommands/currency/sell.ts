import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sell")
        .setDescription("Sell an item")
        .addNumberOption(option =>
            option
                .setName("item")
                .setDescription("The item you want to sell")
                .setRequired(true)
        ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let result = await client.eco.removeUserItem({
            user: interaction.user.id,
            item: interaction.options.getNumber("item"),
        });
        if (result.error) {
            if (result.type == 'Invalid-Item-Number') return interaction.reply('Please enter the item number to remove!')
            if (result.type == 'Unknown-Item') return interaction.reply('The item doesn\'t exist!')
        }
        else {
            let shopItem = await client.eco.getShopItems({ user: interaction.user.id });
            let item = shopItem.inventory.find((item: any) => item.name === result.inventory.name);
            if (item) {
                client.eco.removeMoney({ user: interaction.user.id, amount: item.price, whereToPutMoney: 'wallet' });
                return interaction.reply(`You have sold **${result.inventory.name}** for **$${item.price}**`);
            }
            else {
                return interaction.reply('The item doesn\'t exist!');
            }
        }
    }
}