import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("seek")
        .setDescription("Seek to a specific time in the current track")
        .addIntegerOption(option => option
            .setName("pos")
            .setDescription("The position to seek to.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);

        let pos = interaction.options.getInteger('pos');

        await queue.seek(pos!);

        return interaction.reply(client.getLocale(interaction, "commands.music.seekSuccess", pos));
    },
};