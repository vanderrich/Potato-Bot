import { SlashCommandSubcommandBuilder, time, userMention } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { BirthdayLocaleType } from "../../localization";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("next")
        .setDescription("Get the next birthday."),
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client, footers) {
        await interaction.deferReply();
        const locale = client.getLocale(interaction, "commands.info.birthday") as BirthdayLocaleType;

        const birthdays = await client.birthdays.find({});
        const nextBirthdays = birthdays.filter(async (bday) => await interaction.guild?.members.fetch(bday.userId));

        if (nextBirthdays.length > 0) {
            const birthdayEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle("Birthday")
                .setDescription(client.getLocale(interaction, "commands.info.birthday.nextBday", userMention(nextBirthdays[0].userId), time(nextBirthdays[0].birthday, "F")))
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                .setTimestamp();

            interaction.editReply({ embeds: [birthdayEmbed] });
        }
        else {
            interaction.editReply(locale.noBdays);
        }
    }
} as SlashCommand;