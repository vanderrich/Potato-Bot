const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("See the leaderboard!"),
  category: "Currency",
  async execute(interaction, client, Discord, footers) {
    let leaderboard = await client.eco.leaderboard(10);
    if (!leaderboard || leaderboard.length < 1) return interaction.reply("❌ | Empty Leaderboard!");
    const mappedLeaderboard = leaderboard.map(i => `${client.users.cache.get(i.userId).tag ? client.users.cache.get(i.userId).tag : "Nobody"} - ${i.coinsInWallet}`);

    const embed = new Discord.MessageEmbed()
      .setTitle(`Leaderboard`)
      .setDescription(`${mappedLeaderboard.join('\n')}`)
      .setColor("RANDOM")
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })

    return interaction.reply({ embeds: [embed] })
  }
}