const { SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandSubcommandGroupBuilder()
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
        ),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client, Discord, footers) {
        let subcommand;
        switch (interaction.options.getSubcommand()) {
            case "add":
                subcommand = "addplaylisttrack";
                break;
            case "remove":
                subcommand = "removeplaylisttrack";
                break;
            case "create":
            case "delete":
            case "list":
            case "play":
            case "share":
            case "unshare":
                subcommand = interaction.options.getSubcommand() + "playlist";
                break;
            case "settings":
            case "info":
                subcommand = "playlist" + interaction.options.getSubcommand();
            default:
                break;
        }
        if (subcommand) {
            require(`./playlist/${subcommand}`).execute(interaction, client, Discord, footers);
        }
    }
}