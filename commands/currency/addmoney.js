const {admins} = require("../../config.json")
module.exports = {
  name: "addmoney",
  aliases: ["addbal"],
  usage: `addmoney @user <amount>`,
  async execute(message, args, cmd, client, Discord){
    if (!admins.includes(message.author.id)) return; // return if author isn't bot owner
    let user = message.mentions.users.first();
    if (!user) return message.channel.send("Please specify a user!");
    let amount = parseInt(args[1]);
    if (!amount || isNaN(amount)) return message.reply("Please specify a valid amount.");
    let data = await client.eco.addMoney(user.id, [], amount);
    console.log(data)
    
    const embed = new Discord.MessageEmbed()
      .setTitle(`Money Added!`)
      .addField(`User: <@${user.id}>`)
      .addField(`Balance Given: ${amount} 💸`)
      .addField(`Total Amount: ${data}`)
      .setColor("RANDOM")
    return message.channel.send({ embeds: [embed] })

  }
}