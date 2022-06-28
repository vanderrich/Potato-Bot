import { SlashCommand, Client } from '../../../Util/types';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

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
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        const playlistName = interaction.options.getString("name");
        const playlist = await client.playlists.findOne({ name: playlistName });
        if (!playlist) return interaction.reply("Playlist not found.");
        playlist.tracks = [];
        await playlist.save();
    }
} as SlashCommand;