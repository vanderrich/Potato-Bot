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
                .addChoices(
                    { name: "Low (only racism and other stuff, default)", value: "low" },
                    { name: "Medium (curse words other than f and s and other stuff, recommended)", value: "medium" },
                    { name: "High (most curse words, not recommended)", value: "high" },
                    { name: "Highest (all curse words)", value: "highest" },
                    { name: "Custom", value: "custom" },
                )
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
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("The channel to send the welcome message.")
                .setRequired(false)
            )),
    category: "Moderation",
    permissions: "MANAGE_GUILD",
    execute(interaction, client, Discord, footers) {
        require("./" + interaction.options.getSubcommand()).execute(interaction, client, Discord, footers);
    }
}