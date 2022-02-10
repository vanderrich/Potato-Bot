module.exports = {
  name: "search",
  aliases: ["find"],
  usage: "search",
  async execute(message, args, cmd, client, Discord){
    let users = [
      "Potato Pocket",
      "Potato T-Shirt",
      "Potato Peelers",
      "Potato Street",
      "Potato Town"
    ];
    let amount = Math.floor(Math.random() * 200) + 50;
    let beg = await client.eco.beg(message.author.id, message.guildId, amount, { canLose: true, cooldown: 300000, customName: "search" });
    console.log(beg)
    if (beg.cooldown) return message.reply(`Come back after ${beg.time.minutes} minutes & ${beg.time.seconds} seconds.`);
    if (beg.lost) return message.channel.send(`**${users[Math.floor(Math.random() * users.length)]}:** You were caught! You couldn't get money kiddo.`);
    else return message.reply(`**${users[Math.floor(Math.random() * users.length)]}** was somewhat profitable, you found **${amount}** 💸.`);
  }
}