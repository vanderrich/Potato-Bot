const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inv")
    .setDescription("View your inventory"),
  async execute(interaction, client, Discord, footers) {
    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: `Inventory of ${interaction.user.tag}`, iconURL: interaction.guild.iconURL })
      .setColor("RANDOM")
      .setThumbnail()
      .setTimestamp()
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
    const x = client.db.get(`items_${interaction.user.id}`);
    if (!x) { return interaction.reply(`No Items Found To Display`); }
    const arrayToObject = x.reduce((itemsobj, x) => {
      itemsobj[x.name] = (itemsobj[x.name] || 0) + 1;
      return itemsobj;
    }, {});
    Object.keys(arrayToObject).map(k => embed.addField(`Name: ${k}`, `Quantity: **${arrayToObject[k]}**`, false));

    return interaction.reply({ embeds: [embed] })
  }
}