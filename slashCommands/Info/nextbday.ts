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

        client.birthdays.find({
            guildId: interaction.guild!.id,
            birthday: {
                $gte: new Date(),
            }
        }, function (err: any, nextBirthday: any) {
            if (nextBirthday.length > 0) {
                const birthdayEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle("Birthday")
                    .setDescription(client.getLocale(interaction, "commands.info.birthday.nextBday", userMention(nextBirthday[0].userId), time(nextBirthday[0].birthday, "D")))
                    .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                    .setTimestamp();

                interaction.editReply({ embeds: [birthdayEmbed] });
            }
            else {
                interaction.editReply(locale.noBdays);
            }
        });
    }
} as SlashCommand;