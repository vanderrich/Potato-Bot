import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("jumptoindex")
        .setDescription("Jump to a specific track in the queue.")
        .addIntegerOption(option => option
            .setName("index")
            .setDescription("The index of the track to skip to.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);
        let index = interaction.options.getInteger('index');
        if (!index) return interaction.reply(locale.noIndex);
        if (index < 0) interaction.reply(locale.noNegativeIndex);
        index--;

        queue.jump(index);

        return interaction.reply(locale.skipSuccess);
    },
};