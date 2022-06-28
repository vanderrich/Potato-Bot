import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { QueryType, Track, PlayerSearchResult } from 'discord-player';
import { CommandInteraction } from "discord.js";
import { Music } from "../../../localization";
import { Client, SlashCommand } from "../../../Util/types";

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
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;
        const playlistName = interaction.options.getString("name");
        const url = interaction.options.getString("url");

        const track: PlayerSearchResult = await client.player.search(url!, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!track) return interaction.editReply(locale.noResults);
        if (track.tracks[0].source !== "youtube") return interaction.editReply(locale.onlyYT);

        const playlist = await client.playlists.findOne({
            managers: user.id,
            name: playlistName
        });

        if (!playlist?.tracks) return interaction.editReply(locale.noPlaylist);


        playlist.tracks = playlist.tracks.concat(track.playlist ? track.tracks.map(t => t.url) : [track.tracks[0].url]);
        playlist.save();


        interaction.editReply(locale.addSuccess);
    }
} as SlashCommand;