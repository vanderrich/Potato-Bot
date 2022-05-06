const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money!"),
  category: "Currency",
  async execute(interaction, client, Discord, footers) {
    let users = [
      "A Stranger",
      "A Potato",
      "A Living being",
      "I forgor :skull:",
      "Someone:tm:",
      "Something:tm:",
    ];
    let result = await client.eco.beg({ user: interaction.user.id, minAmount: 1, maxAmount: 5 })
    if (result.error) return interaction.reply(`You have begged recently Try again in ${result.time}`);
    return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}** donated you **${result.amount}** 💸.`);
  }
}