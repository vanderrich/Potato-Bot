import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item!")
        .addNumberOption((option: SlashCommandNumberOption) =>
            option
                .setName("item")
                .setDescription("The ID of the item you want to buy.")
        )
        .addBooleanOption((option: SlashCommandBooleanOption) =>
            option
                .setName("local")
                .setDescription("Whether or not the item is local.")
        )
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("amount")
                .setDescription("The amount to buy.")
        ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any, Discord: any, footers: Array<string>) {
        let item = interaction.options.getNumber("item");
        let local = interaction.options.getBoolean("local");
        if (local && !interaction.guild) return interaction.reply("You can't buy local items in DMs!");

        if (!item) {
            let items = await client.eco.getShopItems(local ? { guild: interaction.guild?.id } : { user: interaction.user.id });
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
        await interaction.deferReply();
        let result = await client.eco.addUserItem({
            user: interaction.user.id,
            guild: local ? interaction.guild : undefined,
            item: item,
        });
        console.log(result);
        if (result.error) {
            if (result.type === 'No-Item') return interaction.editReply('Please provide valid item number');
            if (result.type === 'Invalid-Item') return interaction.editReply('Item does not exist');
            if (result.type === 'low-money') return interaction.editReply(`You're too broke to buy this item.`);
        } else return interaction.editReply(`Successfully bought **${result.inventory.name}** for $${result.inventory.price}`)
    }
}