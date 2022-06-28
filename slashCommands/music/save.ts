import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("save")
        .setDescription("Save the current track to your dms"),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);

        interaction.user.send(client.getLocale(interaction, "commands.music.saveMsg", queue.current.title, queue.current.author, interaction.guild!.name)).then(() => {
            interaction.reply(locale.saveSuccess);
        })
    },
};