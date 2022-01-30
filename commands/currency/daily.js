module.exports = {
  name: "daily",
  aliases: [],
  usage: "daily",
  async execute(message, args, cmd, client, Discord){
    let amount = Math.floor(Math.random() * 500) + 100;
    let addMoney = await client.eco.daily(message.author.id, message.guildId, amount, {});
    if (addMoney.cooldown) return message.reply(`You have already claimed your daily credit. Come back after ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
    else return message.reply(`You have claimed **${addMoney.amount}** 💸 as your daily credit & now you have **${addMoney.money}** 💸.`);
  }
}