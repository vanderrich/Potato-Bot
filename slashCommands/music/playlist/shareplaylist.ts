import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../../localization";
import { Client } from "../../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("share")
        .setDescription("Share a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist, case sensitive.")
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user to share the playlist with.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;

        const playlistName = interaction.options.getString("name");

        const playlist = await client.playlists.findOne({ managers: user.id, name: playlistName });

        if (!playlist?.tracks) return interaction.editReply(locale.noPlaylist);
        if (playlist.tracks.length === 0) return interaction.editReply(locale.emptyPlaylist);

        const res = playlist.tracks;

        const userToShare = interaction.options.getUser("user");
        if (!userToShare) return interaction.editReply(locale.noUser);

        const userToSharePlaylist = await client.playlists.findOne({ creator: userToShare.id, name: playlistName });

        if (userToSharePlaylist) return interaction.editReply(locale.otherHasPlaylist);

        playlist.managers.push(userToShare.id);
        playlist.save();

        return interaction.editReply(client.getLocale(interaction, "commands.music.shareSuccess", userToShare));
    }
}