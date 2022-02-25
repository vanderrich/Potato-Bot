module.exports = {
  name: "transfer",
  aliases: ["give", "share"],
  usage: "transfer <member> <amount>",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    let authordata = client.eco.fetchMoney(message.author.id) 
    if (!member) return message.channel.send('Please mention the person or give their ID') 
    let amount = parseInt(args[1])
    if (!amount || isNaN(amount) || amount < 0) return message.channel.send('Please enter a valid amount to transfer') 
    if(authordata.amount < amount) return message.channel.send('Looks like you don\'t have that much money') 
    await client.eco.subtractMoney(message.author.id, message.guildId, amount).then(client.eco.addMoney(member.id, message.guildId, amount)) 
    return message.channel.send(`You have successfully transferred 💸**${amount}** to ** ${member.user.tag}**.`)
  }
}