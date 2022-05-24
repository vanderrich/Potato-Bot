const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

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
    async execute(interaction, client, Discord, footers) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");

        const playlist = await client.playlists.findOne({ managers: user.id, name: playlistName });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");

        if (playlist.tracks.length === 0) return interaction.editReply("That playlist doesn't have any tracks!");

        const res = playlist.tracks;

        const userToShare = interaction.options.getUser("user");

        const userToSharePlaylist = await client.playlists.findOne({ creator: userToShare.id, name: playlistName });

        if (!userToSharePlaylist) return interaction.editReply(`${userToShare} doesn't have a playlist with that name!`);

        const index = playlist.managers.indexOf(userToShare.id);
        if (index === -1) return interaction.editReply(`${userToShare} doesn't have a playlist with that name!`);

        playlist.managers.splice(index, 1);
        playlist.save();

        return interaction.editReply(`Successfully unshared playlist **${playlistName}** with ${userToShare}`);
    }
}