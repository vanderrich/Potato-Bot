module.exports = {
  name: "buy",
  aliases: [],
  usage: "buy <item>",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    let item = args[0];
    if (!item) {
      let items = Object.keys(client.shop);
      let content = "";
      
      for (var i in items) {
        content += `${items[i]} - :dollar: ${client.shop[items[i]].cost}\n`
      }
      
      let embed = new Discord.MessageEmbed()
      .setTitle("Store")
      .setDescription(content)
      .setColor("BLURPLE")
        .setFooter("Do potat buy <item> to purchase the item.")
      return message.channel.send({ embeds: [embed] });
    }
    let userBalance = await client.eco.fetchMoney(message.author.id, message.guildId);
    if (userBalance.amount < 1) return message.channel.send("Looks like you are so poor lol.");
    
    let amount = args[1]
    if (!amount){
      amount = 1;
    }
    let hasItem = client.shop[item.toLowerCase()];
    if (!hasItem || hasItem == undefined) return message.reply("That item doesnt exists lol");
    let isBalanceEnough = (userBalance >= hasItem.cost);
    if (!isBalanceEnough) return message.reply("Your balance is insufficient. You need :dollar: "+hasItem.cost+" to buy this item.");
    let buy = client.eco.subtractMoney(message.author.id, message.guildId, hasItem.cost);
    
    let itemStruct = {
      name: item.toLowerCase(),
      prize: hasItem.cost
    };
    
    for(let i = 0; i < amount; i++){
      client.db.push(`items_${message.author.id}`, itemStruct);
    }
    return message.channel.send(`You purchased **${amount} ${item}** for **:dollar: ${hasItem.cost}**.`);
  }
}