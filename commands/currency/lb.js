module.exports = {
  name: "lb",
  aliases: ["leaderboard", "ranks"],
  usage: "leaderboard",
  category: "Currency",
  async execute(message, args, cmd, client, Discord, footers) {
    let leaderboard = await client.eco.leaderboard();
    if (!leaderboard || leaderboard.length < 1) return message.channel.send("❌ | Empty Leaderboard!");
    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: `Leaderboard`, iconURL: message.guild.iconURL })
      .setColor("RANDOM")
      .setThumbnail(client.users.cache.get(leaderboard[0].id) ? client.users.cache.get(leaderboard[0].id).displayAvatarURL : "https://cdn.discordapp.com/avatars/603948445362946084/a_f61398e073d78ae104e32b0517c891c3.gif")
      .setTimestamp()
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
    i = 1
    leaderboard.forEach(u => {
      if (client.users.cache.get(u.user)) {
        embed.addField(`${i}. ${client.users.cache.get(u.user).tag}`, `${u.money} 💸`);
        i++
      } else {
        client.eco.delete(u.user)
      }
    });
    return message.channel.send({ embeds: [embed] })
  }
}