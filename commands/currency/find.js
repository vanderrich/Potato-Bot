module.exports = {
  name: "find",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    let users = [
      "Potato Pocket",
      "Potato T-Shirt",
      "Potato Peelers",
      "Potato Street",
      "Potato Town"
    ];
    let amount = Math.floor(Math.random() * 5) + 5;
    let beg = await client.eco.beg(message.author.id, false, amount, { canLose: true, cooldown: 300000, customName: "search" });
    if (beg.cooldown) return message.reply(`Come back after ${beg.time.minutes} minutes & ${beg.time.seconds} seconds.`);
    if (beg.lost) return message.reply(`**${users[Math.floor(Math.random() * users.length)]}:** You were caught! You couldn't get money kiddo.`);
    else return message.reply(`**${users[Math.floor(Math.random() * users.length)]}** was somewhat profitable, you found **${amount}** 💸.`);
  }
}