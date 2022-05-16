const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Birthday commands")
        .addSubcommand(subcommand => subcommand
            .setName("set")
            .setDescription("Set your birthday.")
            .addStringOption(option => option
                .setName("birthdate")
                .setDescription("Your birthdate.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("timezone")
                .setDescription("Your timezone.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("list")
            .setDescription("List all birthdays.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Remove your birthday data.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("next")
            .setDescription("Get the next birthday.")
        )
}