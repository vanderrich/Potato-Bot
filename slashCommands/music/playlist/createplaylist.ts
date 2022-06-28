import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../../localization";
import { Client, SlashCommand } from "../../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Create a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;

        const playlistName = interaction.options.getString("name");

        if (await client.playlists.exists({ managers: user.id, name: playlistName })) return interaction.editReply(locale.haveSamePlaylist);

        const playlist = new client.playlists({
            name: playlistName,
            creator: user.id,
            managers: [user.id],
            tracks: [],
            settings: {
                volume: 75,
                shuffle: false,
                loop: 0,
            }
        });

        await playlist.save();

        interaction.editReply(locale.createPlaylistSuccess);
    }
} as SlashCommand;