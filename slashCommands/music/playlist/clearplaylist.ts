import { SlashCommand, Client } from '../../../Util/types';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Music } from '../../../localization';

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("clear")
        .setDescription("Clear a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist to clear, case sensitive.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        await interaction.deferReply();
        const playlistName = interaction.options.getString("name");
        const playlist = await client.playlists.findOne({ name: playlistName });
        if (!playlist) return interaction.editReply(locale.noPlaylist);
        playlist.tracks = [];
        await playlist.save();
    }
} as SlashCommand;