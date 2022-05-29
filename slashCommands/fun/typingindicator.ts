import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("typingindicator")
        .setDescription("Make the bot send a typing indicator"),
    category: "Fun",
    execute(interaction: CommandInteraction) {
        interaction.reply({ content: "Typing...", ephemeral: true });
        interaction.channel?.sendTyping();
    }
}