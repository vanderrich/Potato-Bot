import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer money to another user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user you want to transfer to")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of money you want to transfer")
                .setRequired(true)
        ),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: any) {
        let user = interaction.options.getUser("user");
        if (!user) return interaction.reply("Please enter a valid user!");
        if (user == interaction.user) return interaction.reply("You cant transfer money to yourself!");
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.reply('Please enter a valid amount to transfer')
        let result = await client.eco.transferMoney({ user: interaction.user.id, user2: user.id, amount });
        if (result.error) return interaction.reply('Looks like you don\'t have that much money')
        return interaction.reply(`You have successfully transferred **$${amount}** to **${user}**.`)
    }
}