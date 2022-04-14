const { SlashCommandBuilder } = require("@discordjs/builders")

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
  async execute(interaction, client) {
    let member = interaction.options.getUser("user");
    if (member == interaction.user) return interaction.reply("You cant transfer money to yourself!");
    let authordata = client.eco.fetchMoney(interaction.user.id)
    let amount = interaction.options.getInteger("amount");
    if (!amount || isNaN(amount) || amount < 0) return interaction.reply('Please enter a valid amount to transfer')
    if (authordata.amount < amount) return interaction.reply('Looks like you don\'t have that much money')
    await client.eco.subtractMoney(interaction.user.id, false, amount).then(client.eco.addMoney(member.id, false, amount))
    return interaction.reply(`You have successfully transferred 💸**${amount}** to ** ${member}**.`)
  }
}