import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the current queue."),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        for (let i = queue.tracks.length - 1; i > 0; i--) {
            queue.shuffle();
        }

        return interaction.reply(`Shuffled queue ✅`);
    },
};