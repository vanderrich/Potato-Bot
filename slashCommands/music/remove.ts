import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

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
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);
        const index = interaction.options.getInteger('index')
        if (!index) return interaction.reply(locale.noIndex);
        queue.remove(queue.tracks[index - 1]);
        return interaction.reply(locale.removeSuccess);
    },
};