import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

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
    execute(interaction: CommandInteraction, client: any, Discord: any, footers: Array<string>) {
        require("./" + interaction.options.getSubcommand()).execute(interaction, client, Discord, footers);
    }
}