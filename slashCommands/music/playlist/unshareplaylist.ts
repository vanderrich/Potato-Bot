import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../../localization";
import { Client } from "../../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("unshare")
        .setDescription("Unshare a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist, case sensitive.")
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user to unshare the playlist with.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");

        const playlist = await client.playlists.findOne({ managers: user.id, name: playlistName });

        if (!playlist?.tracks) return interaction.editReply(locale.noPlaylist);
        if (playlist.tracks.length === 0) return interaction.editReply(locale.emptyPlaylist);

        const userToShare = interaction.options.getUser("user");
        if (!userToShare) return interaction.editReply(locale.noUser);

        const index = playlist.managers.indexOf(userToShare.id);
        if (index === -1) return interaction.editReply(locale.otherDoesntHavePlaylist);

        playlist.managers.splice(index, 1);
        playlist.save();

        return interaction.editReply(client.getLocale(interaction, "commands.music.unshareSuccess", userToShare));
    }
}