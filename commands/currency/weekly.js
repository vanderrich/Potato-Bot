module.exports = {
  name: "weekly",
  usage: "weekly",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    let amount = Math.floor(Math.random() * 1000) + 500;
    let addMoney = await client.eco.weekly(message.author.id, message.guildId, amount, {});
    if (addMoney.cooldown) return message.reply(`You have already claimed your weekly credit. Come back after ${addMoney.time.days} days, ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
    else return message.reply(`You have claimed **${addMoney.amount}** 💸 as your weekly credit & now you have **${addMoney.money}** 💸. `);
  }
}