import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

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
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");

        const playlist = await client.playlists.findOne({ managers: user.id, name: playlistName });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");

        if (playlist.tracks.length === 0) return interaction.editReply("That playlist doesn't have any tracks!");

        const res = playlist.tracks;

        const userToShare = interaction.options.getUser("user");
        if (!userToShare) return interaction.editReply("You must specify a user!");

        const userToSharePlaylist = await client.playlists.findOne({ creator: userToShare.id, name: playlistName });

        if (userToSharePlaylist) return interaction.editReply(`${userToShare} already has a playlist with that name!`);

        playlist.managers.push(userToShare.id);
        playlist.save();

        return interaction.editReply(`Successfully shared playlist **${playlistName}** with ${userToShare}`);
    }
}