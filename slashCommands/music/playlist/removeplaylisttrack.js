const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
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
    category: "Music",
    isSubcommand: true,
    async execute(interaction, client) {
        const playlistName = interaction.options.getString("name");
        const index = interaction.options.getInteger("index");
        const playlist = await client.playlists.findOne({
            managers: interaction.user.id,
            name: playlistName
        });

        if (!playlist?.tracks) return interaction.reply("I couldn't find that playlist!");

        playlist.tracks.splice(index - 1, 1);
        playlist.save();

        interaction.reply(`Removed track from the playlist **${playlistName}**`);
    }
}