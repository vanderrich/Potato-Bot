import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";
const maxVol = 150;

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("volume")
        .setDescription("Set the volume of the current track.")
        .addIntegerOption(option =>
            option
                .setName("vol")
                .setDescription("The volume to set the track to.")
        ),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);

        const vol = interaction.options.getInteger("vol");

        if (!vol) return interaction.reply(client.getLocale(interaction, "commands.music.noVol", queue.volume));

        if (queue.volume === vol) return interaction.reply(locale.volEqualCurrent);

        if (vol < 0 || vol > maxVol) return interaction.reply(locale.volNotInRange);

        queue.setVolume(vol);

        return interaction.reply(client.getLocale(interaction, "commands.music.volSuccess", vol));
    },
};