import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("back")
        .setDescription("Go back to the previous track."),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, No music currently playing! ❌`);

        if (!queue.previousTracks[1]) return interaction.reply(`${interaction.user}, There was no music playing before ❌`);

        await queue.back();

        interaction.reply(`Previous music started playing... ✅`);
    },
};