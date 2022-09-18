import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bulkdelete")
        .setDescription("Bulk delete messages")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of messages to delete")
                .setRequired(true)
        ) as SlashCommandBuilder,
    permissions: "MANAGE_MESSAGES",
    category: "Moderation",
    guildOnly: true,
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.editReply(client.getLocale(interaction, "commands.moderation.modActions.bulkDelete.invalidAmount"));
        let channel = interaction.channel
        if (!channel || channel.type === "DM") return
        channel.bulkDelete(amount)
            .then(() => {
                interaction.editReply("Messages deleted!");
            })
            .catch(err => {
                interaction.editReply("Error deleting messages: " + err);
            })
    }
} as SlashCommand;