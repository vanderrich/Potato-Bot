import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .setNameLocalization("zh-CN", "买")
        .setDescriptionLocalization("zh-CN", "购买一个东西!")
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
    async execute(interaction, client, footers) {
        await interaction.deferReply();
        const item = interaction.options.getString("item");
        const amount = interaction.options.getInteger("amount") || 1;
        const local = item?.endsWith("_local");

        if (!item) {
            const items = await client.eco.getShopItems({ guild: interaction.guild?.id });
            const globalItems = await client.eco.getShopItems({ user: interaction.user.id });
            const inv = globalItems.inventory.concat(items.inventory);

            const embed = new MessageEmbed()
                .setTitle(client.getLocale(interaction, "commands.currency.buy.storeTitle"))
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

            for (const key in inv) {
                embed.addFields({ name: client.getLocale(interaction, "commands.currency.buy.storeItem", key, inv[key].price, inv[key].name), value: inv[key].description })
            }
            return interaction.editReply({ embeds: [embed] });
        }
        if (local) {
            const items = await client.eco.getShopItems({ guild: interaction.guildId });
            const shopItem = items.inventory.find((i: any) => i.id == item?.replace("_local", ""));
            if (!shopItem) {
                return interaction.editReply(client.getLocale(interaction, "commands.currency.buy.noItem"));
            }
            if (shopItem.price * amount > await client.eco.balance({ user: interaction.user.id })) {
                return interaction.editReply(client.getLocale(interaction, "commands.currency.buy.noMoney"));
            }
            await client.eco.addMoney({ user: interaction.user.id, amount: shopItem.price * amount, whereToPutMoney: "wallet" });
        }
        const results = [];
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