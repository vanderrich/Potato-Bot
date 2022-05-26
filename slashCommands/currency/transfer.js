const { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders");
const { ApplicationCommandType } = require("discord-api-types/v9");

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
    contextMenu: new ContextMenuCommandBuilder()
        .setName("transfer")
        .setType(ApplicationCommandType.User),
    category: "Currency",
    async execute(interaction, client) {
        let member = interaction.options.getUser("user") || client.users.cache.get(interaction.targetId);
        if (member == interaction.user) return interaction.reply("You cant transfer money to yourself!");
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.reply('Please enter a valid amount to transfer')
        let result = await client.eco.transferMoney({ user: interaction.user.id, user2: member.id, amount });
        if (result.error) return interaction.reply('Looks like you don\'t have that much money')
        return interaction.reply(`You have successfully transferred **$${amount}** to **${member}**.`)
    }
}