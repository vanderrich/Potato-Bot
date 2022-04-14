module.exports = {
  name: "transfer",
  aliases: ["give", "share", "pay"],
  usage: "transfer <member> <amount>",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    let authordata = client.eco.fetchMoney(message.author.id) 
    if (member == message.author) return message.reply("You cant transfer money to yourself!");
    if (!member) return message.reply('Please mention the person or give their ID') 
    let amount = parseInt(args[1])
    if (!amount || isNaN(amount) || amount < 0) return message.reply('Please enter a valid amount to transfer')
    if (authordata.amount < amount) return message.reply('Looks like you don\'t have that much money') 
    await client.eco.subtractMoney(message.author.id, false, amount).then(client.eco.addMoney(member.id, false, amount)) 
    return message.reply(`You have successfully transferred 💸**${amount}** to ** ${member.user.tag}**.`)
  }
}