import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove a track from the queue")
        .addIntegerOption(option => option
            .setName("index")
            .setDescription("The index of the track to remove.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);
        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        const index = interaction.options.getInteger('index')
        if (!index) return interaction.reply(`${interaction.user}, You must specify an index. ❌`);
        const success = queue.remove(queue.tracks[index - 1]);
        return interaction.reply(success ? `Removed track from queue! ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};