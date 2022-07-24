import { CommandInteraction } from "discord.js";
import { BirthdayLocaleType } from "../../localization";
import { Client, SlashCommand } from "../../Util/types";

const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove your birthday data."),
    category: "Info",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        const user = interaction.user;
        const locale = client.getLocale(interaction, "commands.info.birthday") as BirthdayLocaleType;

        if (!client.birthdays.findOne({ userId: user.id })) return interaction.editReply(locale.noBday);

        client.birthdays.deleteOne({ userId: user.id })
            .then(() => {
                interaction.editReply(locale.removeSuccess);
            })
    }
} as SlashCommand;