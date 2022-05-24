const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("View and edit your settings.")
        .addSubcommand(subcommand => subcommand
            .setName("badwords")
            .setDescription("bad words")
            .addStringOption(option => option
                .setName("preset")
                .setDescription("The preset to use.")
                .setRequired(true)
                .addChoice("Low (only racism and other stuff)", "low")
                .addChoice("Medium (curse words other than f and s words and other stuff, recommended)", "medium")
                .addChoice("High (most curse words, recommended)", "high")
                .addChoice("Highest (all curse words, not recommended)", "highest")
                .addChoice("Custom", "custom")
            )
            .addStringOption(option => option
                .setName("custom")
                .setDescription("The custom bad words to use, seperate with commas.")
                .setRequired(false)
            ))
        .addSubcommand(subcommand => subcommand
            .setName("welcome")
            .setDescription("Welcome stuff")
            .addStringOption(option => option
                .setName("message")
                .setDescription("The welcome message.")
                .setRequired(false)
            )
            .addRoleOption(option => option
                .setName("role")
                .setDescription("The role to give to the user.")
                .setRequired(false)
            )
        ),
    category: "Info",
    execute(interaction, client, Discord, footers) {
        require("./" + interaction.options.getSubcommand()).execute(interaction, client, Discord, footers);
    }
}