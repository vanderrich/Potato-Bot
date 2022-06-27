import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("resume")
        .setDescription("Resume the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue) return interaction.reply(locale.noMusicPlaying);
        queue.setPaused(false);
        return interaction.reply(locale.resumeSuccess);
    },
};