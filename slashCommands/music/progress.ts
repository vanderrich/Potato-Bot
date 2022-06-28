import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("progress")
        .setDescription("See the current track progress"),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);

        const progress = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        if (timestamp.progress == Infinity) return interaction.reply(locale.liveStream);

        interaction.reply(`${progress} (**${timestamp.progress}**%)`);
    }
}