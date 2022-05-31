import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Set your birthday.")
        .addStringOption(option => option
            .setName("birthdate")
            .setDescription("Your birthdate in MM/DD, eg. 01/01")
            .setRequired(true)
        ),
    category: "Info",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        const birthdate = interaction.options.getString("birthdate");
        const user = interaction.user;

        if (!birthdate) return interaction.editReply("You need to specify your birthdate and timezone!");

        let birthdateArray = birthdate.split("/");
        if (birthdateArray.length != 2) return interaction.editReply("Invalid birthdate!");
        if (birthdateArray[0].length != 2 || birthdateArray[1].length != 2) return interaction.editReply("Invalid birthdate!");

        let month = parseInt(birthdateArray[0]);
        let day = parseInt(birthdateArray[1]);
        if (month < 1 || month > 12) return interaction.editReply("Invalid birthdate!");
        if (day < 1 || day > 31) return interaction.editReply("Invalid birthdate!");

        let now = new Date(),
            date = new Date(now.getFullYear(), month - 1, day);
        if (date > now) date.setFullYear(date.getFullYear() - 1);

        if (client.birthdays.findOne({ userId: user.id })) {
            client.birthdays.updateOne({ userId: user.id }, {
                $set: {
                    birthday: date,
                }
            })
                .then(() => {
                    return interaction.editReply("Your birthday has been updated!")
                })
                .catch((err: any) => {
                    interaction.editReply("Something went wrong! Error: " + err); return console.log(err)
                });
        }
        else {
            const birthday = new client.birthdays({
                userId: user.id,
                guildId: interaction.guild ? interaction.guild.id : undefined,
                birthday: date,
            })
            birthday.save().then(() => {
                interaction.editReply("Birthday set!");
                console.log(`[INFO] ${user.tag} set their birthday to ${birthdate}`);
            })
                .catch((err: any) => {
                    console.error(err);
                    interaction.editReply("Something went wrong! Error: " + err);
                });
        }
    }
}