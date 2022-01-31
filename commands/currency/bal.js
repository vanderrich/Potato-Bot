const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bal",
  aliases: ["money", "credits", "balance"],
  usage: `bal`,
  async execute(message, args, cmd, client) {
    let user = message.mentions.users.first() || message.author;
    let userBalance = await client.eco.fetchMoney(user.id, message.guildId);
    const embed = new MessageEmbed()
      .setTitle(`Balance`)
      .addField(`User`, `${user}`)
      .addField(`Balance`, `${userBalance} 💸`)
      .setColor("RANDOM")
      .setThumbnail(user.displayAvatarURL)
      .setTimestamp()
    return message.channel.send(embed);
  }
}
