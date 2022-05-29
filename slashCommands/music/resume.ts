import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("resume")
        .setDescription("Resume the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(false);

        return interaction.reply(success ? `**${queue.current.title}**, The track continues to play. ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};