const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music commands")
        .addSubcommand(subcommand => subcommand
            .setName("back")
            .setDescription("Go back to the previous track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("clear")
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
            .addNumberOption(option => option
                .setName("loop")
                .setDescription("The object to loop")
                .setRequired(true)
                .addChoices(
                    { name: "Off", value: 0 },
                    { name: "Track", value: 1 },
                    { name: "Queue", value: 2 },
                    { name: "Autoplay", value: 3 }
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("pause")
            .setDescription("Pause the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("play")
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
            .setName("resume")
            .setDescription("Resume the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("stop")
            .setDescription("Stop the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("skip")
            .setDescription("Skip the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("shuffle")
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
            .setName("remove")
            .setDescription("Remove a track from the queue.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("save")
            .setDescription("Save the current track.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("search")
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
                .setName("add")
                .setDescription("Add a track to a playlist.")
                .addStringOption(option => option
                    .setName("url")
                    .setDescription("The URL or query of the track to add.")
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("The name of the playlist to add the track to, case sensitive.")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("remove")
                .setDescription("Remove a track from a playlist.")
                .addStringOption(option => option
                    .setName("name")
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
                .setName("create")
                .setDescription("Create a playlist.")
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("The name of the playlist.")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("delete")
                .setDescription("Delete a playlist.")
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("The name of the playlist.")
                    .setRequired(true)

                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("list")
                .setDescription("List all playlists.")
            )
            .addSubcommand(subcommand => subcommand
                .setName("play")
                .setDescription("Play a playlist.")
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("The name of the playlist, case sensitive.")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("settings")
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
                    .addChoices(
                        { name: "Off", value: 0 },
                        { name: "Track", value: 1 },
                        { name: "Queue", value: 2 },
                        { name: "Autoplay", value: 3 }
                    )
                    .setRequired(false)
                )
                .addNumberOption(option => option
                    .setName("volume")
                    .setDescription("Set the volume")
                    .setRequired(false)
                ),
            )
            .addSubcommand(subcommand => subcommand
                .setName("info")
                .setDescription("Get information about a playlist.")
                .addStringOption(option => option
                    .setName("name")
                    .setDescription("The name of the playlist, case sensitive.")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
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
                )
            )
            .addSubcommand(subcommand => subcommand
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
                )
        )
    ),
    execute(interaction, client, Discord, footers) {
        let subcommand;
        try {
            subcommand = interaction.options.getSubcommandGroup();
        } catch (e) {
            subcommand = interaction.options.getSubcommand();
        }
        require("./" + subcommand).execute(interaction, client, Discord, footers);
    }
}