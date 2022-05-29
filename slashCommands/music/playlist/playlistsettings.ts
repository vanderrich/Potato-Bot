import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
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
    async execute(interaction: CommandInteraction, client: any) {
        await interaction.deferReply();
        const user = interaction.user;
        const guild = interaction.guild;

        const shuffle = interaction.options.getBoolean("shuffle");
        const loop = interaction.options.getNumber("loop");
        const volume = interaction.options.getNumber("volume");
        const name = interaction.options.getString("name");

        const playlist = await client.playlists.findOne({
            managers: user.id,
            name: name
        });

        if (!playlist?.tracks) return interaction.editReply("I couldn't find that playlist!");
        console.log(playlist);


        if (shuffle) playlist.settings.shuffle = shuffle;
        if (loop) playlist.settings.loop = loop;
        if (volume) {
            if (volume > maxVol) return interaction.editReply(`Volume can't be higher than ${maxVol}!`);
            playlist.settings.volume = volume;
        }

        await playlist.save();

        interaction.editReply(`**${playlist.name}** settings:\n\n${playlist.settings.shuffle ? "Shuffle: True" : "Shuffle: False"}\n` +
            `${playlist.settings.loop === 0 ? "Loop: None" : playlist.settings.loop === 1 ? "Loop: Track" : playlist.settings.loop === 2 ? "Loop: Queue" : playlist.settings.loop === 3 ? "Loop: Autoplay" : "Impossible edge case, notify developer"}\n` +
            `Volume: ${playlist.settings.volume}%`);
    }
}