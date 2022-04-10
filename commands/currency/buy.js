module.exports = {
  name: "buy",
  aliases: ["shop"],
  usage: "buy <item> [amount]",
  category: "Currency",
  async execute(message, args, cmd, client, Discord) {
    let item = args.join(" ");
    if (item == []) {
      let items = Object.keys(client.shop);
      let content = "";
      
      for (var i in items) {
        content += `${items[i]} - :dollar: ${client.shop[items[i]].cost}\n`
      }
      
      let embed = new Discord.MessageEmbed()
        .setTitle("Store")
        .setDescription(content)
        .setColor("BLURPLE")
        .setFooter({ text: "Use potat buy <item> [amount] to buy an item!" })
      return message.reply({ embeds: [embed] });
    }
    let userBalance = await client.eco.fetchMoney(message.author.id);
    if (userBalance.amount < 1) return message.reply("Looks like you are so poor lol.");
    let hasItem = client.shop[item.toLowerCase()];
    if (!hasItem || hasItem == undefined) {
      item = args.slice(0, -1).join(' ');
      hasItem = client.shop[item.toLowerCase()];
      if (!hasItem || hasItem == undefined)
        return message.reply("That item doesn't exist");
      else
        amount = args[args.length - 1];
    }
    else
      amount = 1
    let isBalanceEnough = (userBalance >= hasItem.cost * amount);
    if (!isBalanceEnough) return message.reply("Your balance is insufficient. You need :dollar: " + hasItem.cost * amount + " to buy this item.");
    client.eco.subtractMoney(message.author.id, false, hasItem.cost * amount);
    
    let itemStruct = {
      name: item.toLowerCase(),
      price: hasItem.cost
    };
    if (amount >= 5000) message.reply('Purchasing items, this might take a while') 
    for(let i = 0; i < amount; i++){
      client.db.push(`items_${message.author.id}`, itemStruct);
    }
    return message.reply(`You purchased **${amount} ${item}** for **:dollar: ${hasItem.cost * amount}**.`);
  }
}