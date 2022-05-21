const { SlashCommandSubcommandBuilder, time, userMention } = require("@discordjs/builders");
const generatePages = require('../../Util/pagination.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("listbday")
        .setDescription("List of all birthdays."),
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client, Discord, footers) {
        const birthdays = await client.birthdays.find({});
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({ name: `Birthdays for ${interaction.guild ? interaction.guild.name : "all servers"}`, iconURL: interaction.guild ? interaction.guild.iconURL() : undefined })
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp();

        if (birthdays.length == 0) {
            embed.setDescription("No birthdays set!");
            return interaction.reply({ embeds: [embed] });
        } else {
            const pages = [];
            let page = 1, emptypage = false;
            do {
                const pageStart = 10 * (page - 1);
                const pageEnd = pageStart + 10;
                birthdays.filter((bday) => client.guilds.cache.get(bday.guildId).members.cache.get(bday.userId))
                const items = birthdays.slice(pageStart, pageEnd).map((m, i) => {
                    return `** ${i + pageStart + 1}**. ${userMention(m.userId)} - ${time(m.birthday, 'd')}`;
                });
                if (items.length) {
                    const embed = new Discord.MessageEmbed();
                    embed.setAuthor({ name: `Birthdays for ${interaction.guild ? interaction.guild.name : "all servers"}`, iconURL: interaction.guild ? interaction.guild.iconURL() : undefined })
                    embed.setDescription(`${items.join('\n')}${birthdays.length > pageEnd
                        ? `\n... ${birthdays.length - pageEnd} more item(s)`
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
                        embed.setDescription("No birthdays set!");
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