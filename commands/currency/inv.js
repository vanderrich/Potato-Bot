module.exports = {
  name: "inventory",
  aliases: ["inv"],
  usage: "inv",
  category: "Currency",
  async execute(message, args, cmd, client, Discord, footers) {
    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: `Inventory of ${message.author.tag}`, iconURL: message.guild.iconURL })
      .setColor("RANDOM")
      .setThumbnail()
      .setTimestamp()
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: message.author.avatarURL({ dynamic: true }) })
    const x = client.db.get(`items_${message.author.id}`);
    if (!x) { return message.reply(`No Items Found To Display`); }
    const arrayToObject = x.reduce((itemsobj, x) => {
        itemsobj[x.name] = (itemsobj[x.name] || 0) + 1;
        return itemsobj;
    }, {});
    const result = Object.keys(arrayToObject).map(k => embed.addField(`Name: ${k}`,`Quantity: **${arrayToObject[k]}**`, false));
    
    return message.reply({ embeds: [embed] })
  }
}