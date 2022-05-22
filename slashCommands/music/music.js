const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music commands")
        .addSubcommand(subcommand => subcommand
            .setName("lasttrack")
            .setDescription("Go back to the previous track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("clearqueue")
            .setDescription("Clear the current queue.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("filter")
            .setDescription("Filter")
            .addStringOption(option => option
                .setName("filter")
                .setDescription("The filter to use")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("skipto")
            .setDescription("Skip to a specific track in the queue, removing other tracks in the way.")
            .addIntegerOption(option => option
                .setName('index')
                .setDescription('The index to skip to')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("loop")
            .setDescription("Loop the track or queue")
            .addStringOption(option => option
                .setName("loop")
                .setDescription("The object to loop")
                .setRequired(true).addChoice("No loop", "off")
                .addChoice("Loop the track", "track")
                .addChoice("Loop the entire queue", "queue")
                .addChoice("autoplay, no idea what this mess is", "autoplay")
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("pausetrack")
            .setDescription("Pause the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("playmusic")
            .setDescription("Play a track.")
            .addStringOption(option => option
                .setName("track")
                .setDescription("The track to play")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("index")
                .setDescription("Index")
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("resumetrack")
            .setDescription("Resume the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("stopqueue")
            .setDescription("Stop the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("skiptrack")
            .setDescription("Skip the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("shufflequeue")
            .setDescription("Shuffle the queue.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("jump")
            .setDescription("Jump to a track in the queue.")
            .addIntegerOption(option => option
                .setName('index')
                .setDescription('The index to jump to')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("volume")
            .setDescription("Change the volume.")
            .addIntegerOption(option => option
                .setName('volume')
                .setDescription('The volume to set')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("nowplaying")
            .setDescription("See the current track")
        )
        .addSubcommand(subcommand => subcommand
            .setName("queue")
            .setDescription("See the current queue")
        )
        .addSubcommand(subcommand => subcommand
            .setName("removetrack")
            .setDescription("Remove a track from the queue.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("savetrack")
            .setDescription("Save the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("searchtrack")
            .setDescription("Search for a track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("seek")
            .setDescription("Seek to a specific time in the current track.")
        )
        .addSubcommandGroup(subcommandGroup => subcommandGroup
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
            )
        )
}