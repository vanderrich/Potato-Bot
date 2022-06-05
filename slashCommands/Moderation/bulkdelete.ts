import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

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
    permissions: "MANAGE_MESSAGES",
    category: "Moderation",
    guildOnly: true,
    execute(interaction: CommandInteraction) {
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.reply("Please enter a valid amount to delete");
        if (interaction.channel?.type === "DM") return interaction.reply("You can't use this command in a DM!");
        interaction.channel?.bulkDelete(amount)
            .then(() => {
                interaction.reply("Messages deleted!");
            })
            .catch(err => {
                interaction.reply("Error deleting messages: " + err);
            })
    }
};