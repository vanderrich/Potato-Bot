import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Music } from "../../../localization";
import { Client, Playlist } from "../../../Util/types";
import { Document } from "mongoose";
const maxVol = 150;

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("settings")
        .setDescription("Playlist settings")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist")
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName("shuffle")
            .setDescription("Shuffle the playlist")
            .setRequired(false)
        )
        .addNumberOption(option => option
            .setName("loop")
            .setDescription("Loop the playlist")
            .addChoices(
                { name: "Off", value: 0 },
                { name: "Track", value: 1 },
                { name: "Queue", value: 2 },
                { name: "Autoplay", value: 3 }
            )
            .setRequired(false)
        )
        .addNumberOption(option => option
            .setName("volume")
            .setDescription("Set the volume")
            .setRequired(false)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const shuffle = interaction.options.getBoolean("shuffle");
        const loop = interaction.options.getNumber("loop");
        const volume = interaction.options.getNumber("volume");
        const name = interaction.options.getString("name");

        const playlist: Document & Playlist | null = await client.playlists.findOne({
            managers: user.id,
            name: name
        });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");
        console.log(playlist);


        if (shuffle) playlist.settings.shuffle = shuffle;
        if (loop) playlist.settings.loop = loop as Playlist["settings"]["loop"];
        if (volume) {
            if (volume > maxVol) return interaction.editReply(`Volume can't be higher than ${maxVol}!`);
            playlist.settings.volume = volume;
        }

        await playlist.save();

        const loopType = locale.loopType[playlist.settings.loop]
        const shuffleLocale = playlist.settings.shuffle ? client.getLocale(interaction, "utils.true") : client.getLocale(interaction, "utils.false");
        interaction.editReply(`**${playlist.name}**:\n\n${client.getLocale(interaction, "commands.music.playlistSettings", shuffleLocale, playlist.settings.volume.toString(), loopType)}`);
    }
}