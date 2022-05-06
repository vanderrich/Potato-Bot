const { SlashCommandBuilder } = require("@discordjs/builders");
const generatePages = require('../../Util/pagination.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inv")
    .setDescription("View your inventory"),
  category: "Currency",
  async execute(interaction, client, Discord, footers) {
    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: `Inventory of ${interaction.user.tag}`, iconURL: interaction.guild.iconURL })
      .setColor("RANDOM")
      .setThumbnail()
      .setTimestamp()
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
    const invPure = await client.eco.getUserItems({ user: interaction.user.id });
    if (!invPure) {
      embed.setDescription(`No items in the inventory.`);
      return interaction.reply({ embeds: [embed] })
    }
    else {
      // const arrayToObject = invPure.reduce((itemsobj, x) => {
      //   itemsobj[x.name] = (itemsobj[x.name] || 0) + 1;
      //   return itemsobj;
      // }, {});
      let inv = invPure.inventory;
      const pages = [];
      let page = 1, emptypage = false;
      do {
        const pageStart = 10 * (page - 1);
        const pageEnd = pageStart + 10;
        const items = inv.slice(pageStart, pageEnd).map((m, i) => {
          return `** ${i + pageStart + 1}**. ${m.name} - ${m.amount} ${m.amount > 1 ? 'items' : 'item'}`;
        });
        if (items.length) {
          const embed = new Discord.MessageEmbed();
          embed.setAuthor({ name: `Inventory of ${interaction.user.tag}`, iconURL: interaction.guild.iconURL })
          embed.setDescription(`${items.join('\n')}${inv.length > pageEnd
            ? `\n... ${inv.length - pageEnd} more item(s)`
            : ''
            } `);
          if (page % 2 === 0) embed.setColor('RANDOM');
          else embed.setColor('RANDOM');
          pages.push(embed);
          page++;
        }
        else {
          emptypage = true;
          if (page === 1) {
            const embed = new Discord.MessageEmbed();
            embed.setAuthor({ name: `Inventory of ${interaction.user.tag}`, iconURL: interaction.guild.iconURL })
            embed.setColor('RANDOM');
            embed.setDescription(`No more items in the inventory.`);
            return interaction.reply({ embeds: [embed] });
          }
          if (page === 2) {
            return interaction.reply({ embeds: [pages[0]] });
          }
        }
      } while (!emptypage);

      generatePages(interaction, pages, { timeout: 40000, fromButton: false });
    }
  }
}