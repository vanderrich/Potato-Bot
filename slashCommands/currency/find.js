const { SlashCommandBuilder } = require("@discordjs/builders");

const users = ["Potato Pocket", "Potato T-Shirt", "Potato Peelers", "Potato Street", "Potato Town"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Find money"),
  category: "Currency",
  async execute(interaction, client) {
    let beg = await client.eco.beg({ user: interaction.user.id, minAmount: 5, maxAmount: 10 });
    if (beg.error) return interaction.reply(`Come back after ${beg.time}.`);
    else return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}** was somewhat profitable, you found **${beg.amount}** 💸.`);
  }
}