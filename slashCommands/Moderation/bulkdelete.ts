import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, SlashCommand } from "../../Util/types";

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
    execute(interaction: CommandInteraction, client: Client) {
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0) return interaction.reply(client.getLocale(interaction, "commands.moderation.modActions.bulkDelete.invalidAmount"));
        let channel = interaction.channel
        if (!channel || channel.type === "DM") return
        channel.bulkDelete(amount)
            .then(() => {
                interaction.reply("Messages deleted!");
            })
            .catch(err => {
                interaction.reply("Error deleting messages: " + err);
            })
    }
} as SlashCommand;