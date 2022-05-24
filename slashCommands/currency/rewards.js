const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rewards")
        .setDescription("Get your rewards!")
        .addSubcommand(subcommand => subcommand
            .setName("hourly")
            .setDescription("Get your hourly reward!")
        )
        .addSubcommand(subcommand => subcommand
            .setName("daily")
            .setDescription("Get your daily reward!")
        )
        .addSubcommand(subcommand => subcommand
            .setName("weekly")
            .setDescription("Get your weekly reward!")
        )
        .addSubcommand(subcommand => subcommand
            .setName("monthly")
            .setDescription("Get your monthly reward!")
        )
        .addSubcommand(subcommand => subcommand
            .setName("yearly")
            .setDescription("Get your yearly rewards!")
    ),
    category: "Currency",
    execute(interaction, client, Discord, footers) {
        require("./" + interaction.options.getSubcommand()).execute(interaction, client, Discord, footers);
    }
}