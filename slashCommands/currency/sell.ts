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
                .setAutocomplete(true)
                .setRequired(true)
    )
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of the item you want to sell")
                .setRequired(true)
    ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let amount = interaction.options.getNumber("amount") || 1;
        let results: { error: boolean, inventory: { name: string }, type: string }[] = []
        for (let i = 0; i < amount; i++) {
            results.push(await client.eco.removeUserItem({
                user: interaction.user.id,
                item: interaction.options.getNumber("item"),
            }));
        }
        if (results[0].error) {
            if (results[0].type == 'Invalid-Item-Number') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.sell.invalidItem"));
            if (results[0].type == 'Unknown-Item') return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.sell.unknownItem"));
        }
        else {
            let shopItem = await client.eco.getShopItems({ user: interaction.user.id });
            let item = shopItem.inventory.find((item: any) => item.name === results[0].inventory.name);
            if (item) {
                client.eco.addMoney({ user: interaction.user.id, amount: item.price, whereToPutMoney: 'wallet' });
                return interaction.reply(client.getLocale(interaction.user.id, "commands.currency.sell.success", amount, item.name, item.price));
            }
            else {
                return interaction.reply('The item doesn\'t exist!');
            }
        }
    }
}