const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("form")
        .setDescription("Forms")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the form.")
            .setRequired(true)
        ),
    category: "Info",
    async execute(interaction, client, Discord, footers) {
        const name = interaction.options.getString("name");

        const modal = new Discord.Modal()
            .setTitle(name)
            .setCustomId(name.charAt(0).toUpperCase() + name.slice(1).replace(/\s/g, ''))
        await interaction.showModal(modal);
    }
}