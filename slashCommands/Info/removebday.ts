import { CommandInteraction } from "discord.js";
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

        if (!client.birthdays.findOne({ userId: user.id })) return interaction.editReply("You don't have any birthday data!");

        client.birthdays.deleteOne({ userId: user.id })
            .then(() => {
                interaction.editReply("Your birthday data has been removed!");
                console.log(`[INFO] ${user.tag} removed their birthday data`);
            })
            .catch((err: any) => {
                console.error(err);
                interaction.editReply("Something went wrong! Error: " + err);
            });
    }
} as SlashCommand;