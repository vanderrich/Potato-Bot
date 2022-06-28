import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("stop")
        .setDescription("Destroy the queue."),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);
        queue.destroy();
        interaction.reply(locale.stopSuccess);
    },
};