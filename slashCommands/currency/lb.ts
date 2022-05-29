import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("See the leaderboard!"),
  category: "Currency",
  async execute(interaction: CommandInteraction, client: any, Discord: any, footers: Array<string>) {
    let leaderboard = await client.eco.globalLeaderboard();
    if (!leaderboard || leaderboard.length < 1) return interaction.reply("❌ | Empty Leaderboard!");

    const embed = new Discord.MessageEmbed()
      .setTitle(`Leaderboard`)
      .setColor("RANDOM")
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })

    let pos = 0;
    leaderboard.slice(0, 10).map((user: any) => {
      if (!client.users.cache.get(user.userID)) return;
      pos++
      embed.addField(`${pos} - **${client.users.cache.get(user.userID).username}**`, `Wallet: **${user.wallet}** - Bank: **${user.bank}**`, true);
    });

    return interaction.reply({ embeds: [embed] })
  }
}