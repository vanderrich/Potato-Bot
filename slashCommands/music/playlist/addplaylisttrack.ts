import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { QueryType, Track, PlayerSearchResult } from 'discord-player';
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
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
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");
        const url = interaction.options.getString("url");

        const track: PlayerSearchResult = await client.player.search(url, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!track) return interaction.editReply("I couldn't find that track!");
        if (track.tracks[0].source !== "youtube") return interaction.editReply("I can't play non YouTube videos!");

        const playlist = await client.playlists.findOne({
            managers: user.id,
            name: playlistName
        });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");


        playlist.tracks = playlist.tracks.concat(track.playlist ? [track.tracks[0].url] : track.tracks.map(t => t.url));
        playlist.save();


        interaction.editReply(`Added track to the playlist **${playlistName}**`);
    }
}