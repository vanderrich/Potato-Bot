const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money!"),
  category: "Currency",
  async execute(interaction, client, Discord, footers) {
    let users = [
      "Potato Moon",
      "Mumbo potato",
      "tat man",
      "super potato"
    ];
    let amount = Math.floor(Math.random() * 5) + 1;
    let beg = await client.eco.beg(interaction.user.id, false, amount, { canLose: true });
    if (beg.cooldown) return interaction.reply(`Begon Thot! Come back after ${beg.time.seconds} seconds.`);
    if (beg.lost) return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}:** Begon Thot! Try again later.`);
    else return interaction.reply(`**${users[Math.floor(Math.random() * users.length)]}** donated you **${amount}** 💸.`);
  }
}