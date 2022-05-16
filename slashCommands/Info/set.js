const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
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
        ),
    category: "Info",
    isSubcommand: true,
    execute(interaction, client, Discord, footers) {
        const birthdate = interaction.options.getString("birthdate");
        const timezone = interaction.options.getString("timezone");
        const user = interaction.message.author;
    }
}