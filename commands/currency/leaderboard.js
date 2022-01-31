module.exports = {
  name: "lb",
  aliases: ["leaderboard", "ranks"],
  usage: "leaderboard",
  async execute(message, args, cmd, client, Discord) {
    let leaderboard = await client.eco.leaderboard(message.guildId, 15);
    if (!leaderboard || leaderboard.length < 1) return message.channel.send("❌ | Empty Leaderboard!");
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Leaderboard of ${message.guild.name}!`, message.guild.iconURL)
      .setColor("RANDOM")
      .setThumbnail(client.users.cache.get(leaderboard[0].id) ? client.users.cache.get(leaderboard[0].id).displayAvatarURL : "https://cdn.discordapp.com/avatars/603948445362946084/a_f61398e073d78ae104e32b0517c891c3.gif")
      .setTimestamp();
    leaderboard.forEach(u => {
      embed.addField(`${u.position}. ${client.users.cache.get(u.user) ? client.users.cache.get(u.user).tag : "Unknown#0000"}`, `${u.money} 💸`);
    });
    return message.channel.send(embed);
  }
}