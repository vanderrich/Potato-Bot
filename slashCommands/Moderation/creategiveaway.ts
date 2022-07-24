import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import ms from "ms";
import { Giveaway } from "discord-giveaways"
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("creategiveaway")
        .setDescription("Create a new giveaway")
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("The duration of the giveaway (in milliseconds)")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("winners")
                .setDescription("The amount of winners")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("prize")
                .setDescription("The prize of the giveaway")
                .setRequired(true)
    ) as SlashCommandBuilder,
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    guildOnly: true,
    execute(interaction: CommandInteraction, client: Client) {
        let duration = interaction.options.getString("duration");
        let winners = interaction.options.getInteger("winners");
        let prize = interaction.options.getString("prize");

        client.giveawaysManager.start(interaction.channel, {
            duration: ms(duration),
            winnerCount: winners,
            prize: prize,
            hostedBy: interaction.user.tag
        }).then((gData: Giveaway) => {
            interaction.reply({ content: `Giveaway created!\n\n${gData.toString()}`, ephemeral: true });
        });
    }
} as SlashCommand;