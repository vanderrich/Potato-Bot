const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music commands")
        .addSubcommand(subcommand => subcommand.setName("back").setDescription("Go back to the previous track."))
        .addSubcommand(subcommand => subcommand.setName("clear").setDescription("Clear the current queue."))
        .addSubcommand(subcommand => subcommand.setName("filter").setDescription("Filter").addStringOption(option => option.setName("filter").setDescription("The filter to use").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("skipto").setDescription("Skip to a specific track in the queue, removing other tracks in the way.").addIntegerOption(option => option.setName('index').setDescription('The index to skip to').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("loop").setDescription("Loop the track or queue").addStringOption(option => option.setName("loop").setDescription("The object to loop").setRequired(true).addChoice("off", "No loop").addChoice("track", "Loop the current track").addChoice("queue", "Loop the entire queue").addChoice("autoplay", "idk tbh")))
        .addSubcommand(subcommand => subcommand.setName("play").setDescription("Play a track.").addStringOption(option => option.setName("track").setDescription("The track to play").setRequired(true)).addIntegerOption(option => option.setName("index").setDescription("Index").setRequired(false)))
        .addSubcommand(subcommand => subcommand.setName("pause").setDescription("Pause the current track."))
        .addSubcommand(subcommand => subcommand.setName("resume").setDescription("Resume the current track."))
        .addSubcommand(subcommand => subcommand.setName("stop").setDescription("Stop the current track."))
        .addSubcommand(subcommand => subcommand.setName("skip").setDescription("Skip the current track."))
        .addSubcommand(subcommand => subcommand.setName("shuffle").setDescription("Shuffle the queue."))
        .addSubcommand(subcommand => subcommand.setName("jump").setDescription("Jump to a track in the queue.").addIntegerOption(option => option.setName('index').setDescription('The index to jump to').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("volume").setDescription("Change the volume.").addIntegerOption(option => option.setName('volume').setDescription('The volume to set').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("nowplaying").setDescription("See the current track"))
        .addSubcommand(subcommand => subcommand.setName("queue").setDescription("See the current queue"))
        .addSubcommand(subcommand => subcommand.setName("remove").setDescription("Remove a track from the queue."))
        .addSubcommand(subcommand => subcommand.setName("save").setDescription("Save the current track."))
        .addSubcommand(subcommand => subcommand.setName("search").setDescription("Search for a song."))
        .addSubcommand(subcommand => subcommand.setName("seek").setDescription("Seek to a specific time in the current track."))
}