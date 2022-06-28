import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Client } from "../../Util/types";
import { Music } from "../../localization";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("clear")
        .setDescription("Clear the queue."),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);

        await queue.clear();

        interaction.reply(locale.clearSuccess);
    },
};