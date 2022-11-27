import { SlashCommandSubcommandBuilder, time, userMention } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { BirthdayLocaleType } from "../../localization.js";
import generatePages from '../../Util/pagination.js';
import { Birthday, SlashCommand } from "../../Util/types.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List of all birthdays in the server."),
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client, footers) {
        await interaction.deferReply();
        const locale = client.getLocale(interaction, "commands.info.birthday") as BirthdayLocaleType;
        const birthdays = (await client.birthdays.find({})).filter((birthday) => interaction.guild!.members.fetch(birthday.userId))
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({ name: client.getLocale(interaction, "commands.info.birthday.listEmbedTitle", interaction.guild ? interaction.guild.name : "all servers") })
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setTimestamp();

        console.log(birthdays)
        if (birthdays.length == 0) {
            embed.setDescription(locale.noBdays);
            return interaction.editReply({ embeds: [embed] });
        } else {
            const pages = [];
            let page = 1, emptypage = false;
            do {
                const pageStart = 10 * (page - 1);
                const pageEnd = pageStart + 10;
                birthdays.filter((bday: Birthday) => client.guilds.cache.get(bday.guildId)?.members.cache.get(bday.userId))
                const items = birthdays.slice(pageStart, pageEnd).map((m: Birthday, i: number) => {
                    return `**${i + pageStart + 1}**. ${userMention(m.userId)} - ${time(m.birthday, 'F')}`;
                });
                if (items.length) {
                    embed.setDescription(`${items.join('\n')}${birthdays.length > pageEnd ? `\n... ${birthdays.length - pageEnd} more item(s)` : ''}`);
                    if (page % 2 === 0) embed.setColor('RANDOM');
                    else embed.setColor('RANDOM');
                    pages.push(embed)
                    page++;
                }
                else {
                    emptypage = true;
                    if (page === 1) {
                        embed.setDescription(locale.noBday);
                        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                        return interaction.editReply({ embeds: [embed] });
                    }
                    if (page === 2) {
                        return interaction.editReply({ embeds: [pages[0]] });
                    }
                }
            } while (!emptypage);

            generatePages(interaction, pages, client, { timeout: 40000, fromButton: false });
        }

    }
} as SlashCommand;