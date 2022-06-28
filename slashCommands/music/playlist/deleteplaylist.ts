import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../../localization";
import { Client, SlashCommand } from "../../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("delete")
        .setDescription("Delete a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist, case sensitive.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        let name = interaction.options.getString("name");
        const deleted = await client.playlists.deleteOne({
            creator: interaction.user.id,
            name: name
        });
        if (deleted.deletedCount === 0) return interaction.editReply(locale.noPlaylist);
        interaction.editReply(locale.deletePlaylistSuccess);
    }
} as SlashCommand;