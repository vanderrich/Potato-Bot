const { SlashCommandSubcommandBuilder, userMention, time } = require("@discordjs/builders");
const { QueryType } = require('discord-player');


module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("play")
        .setDescription("Play a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist to play, case sensitive.")
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


        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.editReply(`${interaction.user}, I can't join audio channel, try joining to a voice channel or change the permissions of the voice channel. ❌`);
        }

        const tracks = await res.map(async track => {
            return new Promise(async (resolve, reject) => {
                client.player.search(track, {
                    requestedBy: interaction.member,
                    searchEngine: QueryType.AUTO
                }).then(trackToPlay => {
                    return resolve(trackToPlay.tracks[0]);
                });
            });
        })

        const tracksToPlay = await Promise.all(tracks);

        queue.addTracks(tracksToPlay);

        if (!queue.playing) await queue.play();
        if (playlist.settings.shuffle) {
            for (let i = queue.tracks.length - 1; i > 0; i--) {
                queue.shuffle();
            }
        }
        if (playlist.settings.loop) queue.setRepeatMode(playlist.settings.loop);
        if (playlist.settings.volume) queue.setVolume(playlist.settings.volume);

        interaction.editReply(`Added playlist to the queue! 🎧`);
    }
}