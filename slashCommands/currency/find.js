const { SlashCommandBuilder } = require("@discordjs/builders");

const users = ["Potato Pocket", "Potato T-Shirt", "Potato Peelers", "Potato Street", "Potato Town"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Find money"),
  async execute(interaction, client) {
    let amount = Math.floor(Math.random() * 200) + 50;
    let beg = await client.eco.beg(interaction.user.id, false, amount, { canLose: true, cooldown: 300000, customName: "search" });
    if (beg.cooldown) return interaction.reply(`Come back after ${beg.time.minutes} minutes & ${beg.time.seconds} seconds.`);
    if (beg.lost) return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}:** You were caught! You couldn't get money kiddo.`);
    else return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}** was somewhat profitable, you found **${amount}** 💸.`);
  }
}