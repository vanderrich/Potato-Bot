const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

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
        ),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    execute(interaction, client, Discord, footers) {
        let duration = interaction.options.getString("duration");
        let winners = interaction.options.getInteger("winners");
        let prize = interaction.options.getString("prize");

        client.giveawaysManager.start(interaction.channel, {
            duration: ms(duration),
            winnerCount: winners,
            prize: prize,
            hostedBy: interaction.member.user.tag
        }).then((gData) => {
            interaction.reply({ content: `Giveaway created!\n\n${gData.toString()}`, ephemeral: true });
        });
    }
};