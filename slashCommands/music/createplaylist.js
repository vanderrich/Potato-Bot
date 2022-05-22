const { SlashCommandSubcommandBuilder, userMention, time } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("createplaylist")
        .setDescription("Create a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction, client, Discord, footers) {
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");

        const playlist = new client.playlists({
            guildId: guild.id,
            name: playlistName,
            owner: user.id,
            tracks: [],
            settings: {
                volume: 75,
                shuffle: false,
                loop: 0,
            }
        });

        await playlist.save();

        interaction.reply(`Created playlist **${playlistName}**`);
    }
}