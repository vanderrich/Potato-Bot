const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("daily")
    .setDescription("Get your daily reward!"),
  category: "Currency",
  async execute(interaction, client) {
    let amount = Math.floor(Math.random() * 50) + 10;
    let addMoney = await client.eco.daily(interaction.user.id, false, amount, {});
    if (addMoney.cooldown) return interaction.reply(`You have already claimed your daily credit. Come back after ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
    else return interaction.reply(`You have claimed **${addMoney.amount}** 💸 as your daily credit & now you have **${addMoney.money}** 💸.`);
  }
}