import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("The ID of the item you want to buy.")
                .setAutocomplete(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount to buy.")
        ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        let item = interaction.options.getString("item");
        let amount = interaction.options.getInteger("amount") || 1;
        let local = item?.endsWith("_local");

        console.log(item, local);
        if (!item) {
            let items = await client.eco.getShopItems({ guild: interaction.guild?.id });
            let globalItems = await client.eco.getShopItems({ user: interaction.user.id });
            let inv = items.inventory.concat(globalItems.inventory);

            let embed = new MessageEmbed()
                .setTitle("Store")
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

            for (let key in inv) {
                embed.addField(`${parseInt(key) + 1} - Price: $${inv[key].price} - **${inv[key].name}:**`, inv[key].description)
            }
            return interaction.reply({ embeds: [embed] });
        }
        await interaction.deferReply();
        if (local) {
            let items = await client.eco.getShopItems({ guild: interaction.guildId });
            let shopItem = items.inventory.find((i: any) => i.id == item?.replace("_local", ""));
            if (!shopItem) {
                return interaction.editReply("Item not found!");
            }
            if (shopItem.price * amount > await client.eco.balance({ user: interaction.user.id })) {
                return interaction.editReply("You don't have enough money!");
            }
            await client.eco.addMoney({ user: interaction.user.id, amount: shopItem.price * amount, whereToPutMoney: "wallet" });
        }
        let result = await client.eco.addUserItem({
            user: interaction.user.id,
            guild: local ? interaction.guild : undefined,
            item: local ? parseInt(item.replace("_local", "")) : parseInt(item),
        });
        console.log(result);
        if (result.error) {
            if (result.type === 'No-Item') return interaction.editReply('Please provide valid item number');
            if (result.type === 'Invalid-Item') return interaction.editReply('Item does not exist');
            if (result.type === 'low-money') return interaction.editReply(`You're too broke to buy this item.`);
        } else return interaction.editReply(`Successfully bought **${result.inventory.name}** for $${result.inventory.price}`)
    }
}