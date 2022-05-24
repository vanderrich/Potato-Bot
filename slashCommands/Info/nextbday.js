const { SlashCommandSubcommandBuilder, userMention, time } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("next")
        .setDescription("Get the next birthday."),
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client, Discord, footers) {
        const user = interaction.user;
        const guild = interaction.guild;

        const birthdayConfig = await client.birthdayConfigs.findOne({ guildId: guild.id });

        if (!birthdayConfig) return interaction.reply("You don't have any birthday data!");

        client.birthdays.find({
            guildId: guild.id,
            birthday: {
                $gte: new Date(),
            }
        }, function (err, nextBirthday) {
            if (err) return interaction.reply("Something went wrong!");

            console.log(nextBirthday);
            if (nextBirthday.length > 0) {
                const birthdayEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle("Birthday")
                    .setDescription(`${userMention(nextBirthday[0].userId)}'s birthday is next on ${time(nextBirthday[0].birthday, 'D')}`)
                    .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL() })
                    .setTimestamp();

                interaction.reply({ embeds: [birthdayEmbed] });
            }
            else {
                interaction.reply("There are no birthdays!");
            }
        });
    }
}