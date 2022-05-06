const { SlashCommandBuilder } = require("@discordjs/builders");
const backup = require("discord-backup");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bulkdelete")
        .setDescription("Bulk delete messages")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of messages to delete")
                .setRequired(true)
        ),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    execute(interaction) {
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.reply("Please enter a valid amount to delete");
        interaction.channel.bulkDelete(amount)
            .then(() => {
                interaction.reply("Messages deleted!");
            })
            .catch(err => {
                interaction.reply("Error deleting messages: " + err);
            })
    }
};