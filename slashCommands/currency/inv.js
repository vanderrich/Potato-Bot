const { SlashCommandBuilder } = require("@discordjs/builders");
const generatePages = require('../../pagination.js');

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
    const inv = client.db.get(`items_${interaction.user.id}`);
    if (!inv) {
      embed.setDescription(`No items in the inventory.`);
    }
    else {
      const pages = [];
      let page = 1, emptypage = false, usedby = `[${interaction.member}]\n`;
      do {
        const pageStart = 10 * (page - 1);
        const pageEnd = pageStart + 10;
        const items = inv.tracks.slice(pageStart, pageEnd).map((m, i) => {
          const title = m.name;
          return `**${i + pageStart + 1}**. ${title} ${m.price}`;
        });
        if (items.length) {
          const embed = new Discord.MessageEmbed();
          embed.setDescription(`${items.join('\n')}${inv.length > pageEnd
            ? `\n... ${inv.length - pageEnd} more track(s)`
            : ''
            }`);
          if (page % 2 === 0) embed.setColor('#b84e44');
          else embed.setColor('#44b868');
          pages.push(embed);
          page++;
        }
        else {
          emptypage = true;
          if (page === 1) {
            const embed = new Discord.MessageEmbed();
            embed.setColor('RANDOM');
            embed.setDescription(`No more items in the inventory.`);
            return interaction.reply({ embeds: [embed] });
          }
          if (page === 2) {
            return interaction.reply({ embeds: [pages[0]] });
          }
        }
      } while (!emptypage);

    }
    return interaction.reply({ embeds: [embed] })
  }
}