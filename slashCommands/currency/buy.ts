import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

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
    ) as SlashCommandBuilder,
    category: "Currency",
    async execute(interaction: CommandInteraction, client: Client, footers: Array<string>) {
        await interaction.deferReply();
        let item = interaction.options.getString("item");
        let amount = interaction.options.getInteger("amount") || 1;
        let local = item?.endsWith("_local");

        if (!item) {
            let items = await client.eco.getShopItems({ guild: interaction.guild?.id });
            let globalItems = await client.eco.getShopItems({ user: interaction.user.id });
            let inv = globalItems.inventory.concat(items.inventory);

            let embed = new MessageEmbed()
                .setTitle(client.getLocale(interaction, "commands.currency.buy.storeTitle"))
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

            for (let key in inv) {
                embed.addField(client.getLocale(interaction, "commands.currency.buy.storeItem", key, inv[key].price, inv[key].name), inv[key].description)
            }
            return interaction.editReply({ embeds: [embed] });
        }
        if (local) {
            let items = await client.eco.getShopItems({ guild: interaction.guildId });
            let shopItem = items.inventory.find((i: any) => i.id == item?.replace("_local", ""));
            if (!shopItem) {
                return interaction.editReply(client.getLocale(interaction, "commands.currency.buy.noItem"));
            }
            if (shopItem.price * amount > await client.eco.balance({ user: interaction.user.id })) {
                return interaction.editReply(client.getLocale(interaction, "commands.currency.buy.noMoney"));
            }
            await client.eco.addMoney({ user: interaction.user.id, amount: shopItem.price * amount, whereToPutMoney: "wallet" });
        }
        let results = [];
        for (let i = 0; i < amount; i++) {
            results.push(await client.eco.addUserItem({
                user: interaction.user.id,
                guild: local ? interaction.guild : undefined,
                item: local ? parseInt(item.replace("_local", "")) : parseInt(item),
            }));
        }
        client.updateCache();
        if (results[0].error) {
            if (results[0].type === 'No-Item' || results[0].type === 'Invalid-Item') return interaction.editReply(client.getLocale(interaction, "commands.currency.buy.noItem"));
            if (results[0].type === 'low-money') return interaction.editReply(`You're too broke to buy this item.`);
        } else return interaction.editReply(client.getLocale(interaction, "commands.currency.buy.success", amount, results[0].inventory.name, results[0].inventory.price * amount));
    }
} as SlashCommand;