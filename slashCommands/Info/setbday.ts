import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { BirthdayLocaleType } from "../../localization";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Set your birthday.")
        .addStringOption(option => option
            .setName("birthdate")
            .setDescription("Your birthdate in MM/DD, eg. 01/01")
            .setRequired(true)
        ) ,
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client) {
        await interaction.deferReply();
        const birthdate = interaction.options.getString("birthdate");
        const user = interaction.user;
        const locale = client.getLocale(interaction, "commands.info.birthday") as BirthdayLocaleType;

        if (!birthdate) return interaction.editReply(locale.noBdate);

        const birthdateArray = birthdate.split("/");
        const month = parseInt(birthdateArray[0]);
        const day = parseInt(birthdateArray[1]);
        if (birthdateArray.length != 2 || (birthdateArray[0].length != 2 || birthdateArray[1].length != 2) || (month < 1 || month > 12) || (day < 1 || day > 31)) return interaction.editReply(locale.invalidBdate);

        const now = new Date(),
            date = new Date(now.getFullYear(), month - 1, day);
        if (date > now) date.setFullYear(date.getFullYear() - 1);

        if (await client.birthdays.exists({ userId: user.id })) {
            client.birthdays.updateOne({ userId: user.id }, {
                $set: {
                    birthday: date,
                }
            })
                .then(() => {
                    return interaction.editReply(locale.updateSuccess)
                });
        }
        else {
            const birthday = new client.birthdays({
                userId: user.id,
                birthday: date,
            })
            birthday.save().then(() => {
                interaction.editReply(locale.setSuccess);
            });
        }
    }
} as SlashCommand;