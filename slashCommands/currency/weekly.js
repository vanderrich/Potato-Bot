const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weekly")
    .setDescription("Get your weekly reward!"),
  async execute(interaction, client) {
    let amount = Math.floor(Math.random() * 1000) + 500;
    let addMoney = await client.eco.weekly(interaction.user.id, false, amount, {});
    if (addMoney.cooldown) return interaction.reply(`You have already claimed your weekly credit. Come back after ${addMoney.time.days} days, ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
    else return interaction.reply(`You have claimed **${addMoney.amount}** 💸 as your weekly credit & now you have **${addMoney.money}** 💸. `);
  }
}