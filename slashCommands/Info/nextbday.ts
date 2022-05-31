import { SlashCommandSubcommandBuilder, time, userMention } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("next")
        .setDescription("Get the next birthday."),
    category: "Info",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const guild = interaction.guild;
        if (!guild) return interaction.reply("This command can only be used in a server.");

        const birthdayConfig = await client.birthdayConfigs.findOne({ guildId: guild.id });

        if (!birthdayConfig) return interaction.reply("You don't have any birthday data!");

        client.birthdays.find({
            guildId: guild.id,
            birthday: {
                $gte: new Date(),
            }
        }, function (err: any, nextBirthday: any) {
            if (err) return interaction.reply("Something went wrong!");

            if (nextBirthday.length > 0) {
                const birthdayEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle("Birthday")
                    .setDescription(`${userMention(nextBirthday[0].userId)}'s birthday is next on ${time(nextBirthday[0].birthday, 'D')}`)
                    .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                    .setTimestamp();

                interaction.reply({ embeds: [birthdayEmbed] });
            }
            else {
                interaction.reply("There are no birthdays!");
            }
        });
    }
}