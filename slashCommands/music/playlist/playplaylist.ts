import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { QueryType, Track } from "discord-player";
import { CommandInteraction, GuildMember } from "discord.js";
import { Music } from "../../../localization";
import { Client, Playlist } from "../../../Util/types";
import * as playdl from "play-dl";

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
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;
        const playlistName = interaction.options.getString("name");
        let member = interaction.member
        if (!(member instanceof GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id)

        const playlist: Playlist | null = await client.playlists.findOne({ managers: user.id, name: playlistName });

        if (!playlist?.tracks) return interaction.editReply(locale.noPlaylist);

        if (playlist.tracks.length === 0) return interaction.editReply(locale.emptyPlaylist);

        const res = playlist.tracks;

        const queue = await client.player.createQueue(interaction.guild!, {
            metadata: interaction.channel,
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 10000,
            autoSelfDeaf: true,
            initialVolume: playlist.settings.volume,
            async onBeforeCreateStream(track, source, _queue) {
                return (await playdl.stream(track.url)).stream;
            },
        });

        try {
            if (!queue.connection) await queue.connect(member.voice.channel!);
        } catch {
            await client.player.deleteQueue(interaction.guildId!);
            return interaction.editReply(locale.cantJoin);
        }

        const tracks = res.map(async (track: string) => {
            return new Promise(async (resolve, reject) => {
                client.player.search(track, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                }).then((trackToPlay) => {
                    return resolve(trackToPlay.tracks[0]);
                });
            });
        })

        const tracksToPlay: Track[] = await Promise.all(tracks) as Track[];

        queue.addTracks(tracksToPlay);

        if (playlist.settings.shuffle) queue.shuffle();
        if (playlist.settings.loop) queue.setRepeatMode(playlist.settings.loop);
        if (!queue.playing) await queue.play();

        interaction.editReply(client.getLocale(interaction, "commands.music.playSuccess", "Playlist"));
    }
}