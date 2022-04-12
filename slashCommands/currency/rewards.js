const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rewards")
        .setDescription("Get your rewards!")
        .addSubcommand(subcommand => subcommand.setName("daily").setDescription("Get your daily reward!"))
        .addSubcommand(subcommand => subcommand.setName("weekly").setDescription("Get your weekly reward!"))
        .addSubcommand(subcommand => subcommand.setName("monthly").setDescription("Get your monthly reward!"))
}