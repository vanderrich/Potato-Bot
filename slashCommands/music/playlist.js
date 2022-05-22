const { SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandSubcommandGroupBuilder()
        .setName("playlist")
        .setDescription("Playlist commands.")
        .addSubcommand(subcommand => subcommand
            .setName("addplaylisttrack")
            .setDescription("Add a track to a playlist.")
            .addStringOption(option => option
                .setName("url")
                .setDescription("The URL or query of the track to add.")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("playlist")
                .setDescription("The name of the playlist to add the track to, case sensitive.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("removeplaylisttrack")
            .setDescription("Remove a track from a playlist.")
            .addStringOption(option => option
                .setName("playlist")
                .setDescription("The name of the playlist to add the track to, case sensitive.")
                .setRequired(true)
            )
            .addIntegerOption(option =>
                option
                    .setName("index")
                    .setDescription("The index to remove")
                    .setRequired(true)
            ),
        )
        .addSubcommand(subcommand => subcommand
            .setName("createplaylist")
            .setDescription("Create a playlist.")
            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the playlist.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("deleteplaylist")
            .setDescription("Delete a playlist.")
            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the playlist.")
                .setRequired(true)

            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("listplaylist")
            .setDescription("List all playlists.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("playplaylist")
            .setDescription("Play a playlist.")
            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the playlist, case sensitive.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("playlistsettings")
            .setDescription("Playlist settings.")
            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the playlist")
                .setRequired(true)
            )
            .addBooleanOption(option => option
                .setName("shuffle")
                .setDescription("Shuffle the playlist")
                .setRequired(false)
            )
            .addNumberOption(option => option
                .setName("loop")
                .setDescription("Loop the playlist")
                .addChoice("No loop", 0)
                .addChoice("Loop the track", 1)
                .addChoice("Loop the entire queue", 2)
                .addChoice("autoplay", 3)
                .setRequired(false)
            )
            .addNumberOption(option => option
                .setName("volume")
                .setDescription("Set the volume")
                .setRequired(false)
            ),
        )
        .addSubcommand(subcommand => subcommand
            .setName("playlistinfo")
            .setDescription("Get information about a playlist.")
            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the playlist, case sensitive.")
                .setRequired(true)
            )
        ),
    category: "Music",
    isSubcommand: true,
}