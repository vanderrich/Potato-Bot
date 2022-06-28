import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { QueryType } from "discord-player";
import { CommandInteraction, GuildMember } from "discord.js";
import { Playlist } from "../../../Util/types";


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
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        const user = interaction.user;
        const playlistName = interaction.options.getString("name");
        let member = interaction.member
        if (!(member instanceof GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id)

        const playlist: Playlist = await client.playlists.findOne({ managers: user.id, name: playlistName });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");

        if (playlist.tracks.length === 0) return interaction.editReply("That playlist doesn't have any tracks!");

        const res = playlist.tracks;

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel,
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 10000,
            autoSelfDeaf: true,
            initialVolume: playlist.settings.volume
        });

        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guildId);
            return interaction.editReply(`${interaction.user}, I can't join audio channel, try joining to a voice channel or change the permissions of the voice channel. ❌`);
        }

        const tracks = await res.map(async (track: string) => {
            return new Promise(async (resolve, reject) => {
                client.player.search(track, {
                    requestedBy: interaction.member,
                    searchEngine: QueryType.AUTO
                }).then((trackToPlay: any) => {
                    return resolve(trackToPlay.tracks[0]);
                });
            });
        })

        const tracksToPlay = await Promise.all(tracks);

        queue.addTracks(tracksToPlay);

        if (playlist.settings.shuffle) queue.shuffle();
        if (playlist.settings.loop) queue.setRepeatMode(playlist.settings.loop);
        if (!queue.playing) await queue.play();

        interaction.editReply(`Added playlist to the queue! 🎧`);
    }
}