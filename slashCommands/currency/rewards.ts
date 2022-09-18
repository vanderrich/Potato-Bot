import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

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
        ) as SlashCommandBuilder,
    category: "Currency",
    execute(interaction, client, footers) {
        require("./" + interaction.options.getSubcommand()).execute(interaction, client, footers);
    }
} as SlashCommand;