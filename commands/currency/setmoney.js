const {admins} = require("../../config.json")
module.exports = {
  name: "setmoney",
  usage: "setmoney @user <amount>",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    if (!admins.includes(message.author.id)) return;
    let user = message.mentions.users.first();
    if (!user) return message.channel.send("Please specify a user!");
    let amount = parseInt(args[1]);
    if (!amount || isNaN(amount)) return message.reply("Please specify a valid amount.");
    let data = client.eco.setMoney(user.id, message.guildId, amount);
    const embed = new Discord.MessageEmbed()
      .setTitle(`Money Updated!`)
      .addField(`User`, `<@${user.id}>`)
      .addField(`Total Amount`, amount)
      .setColor("RANDOM")
      .setThumbnail(user.displayAvatarURL)
      .setTimestamp();
    return message.channel.send({ embeds: [embed] })
  }
}