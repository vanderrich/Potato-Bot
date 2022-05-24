const { SlashCommandSubcommandBuilder, userMention, time } = require("@discordjs/builders");

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
    async execute(interaction, client, Discord, footers) {
        const user = interaction.user;
        const guild = interaction.guild;

        const playlistName = interaction.options.getString("name");

        if (await client.playlists.findOne({ managers: user.id, name: playlistName })) return interaction.reply("You already have a playlist with that name!");

        const playlist = new client.playlists({
            guildId: guild.id,
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

        interaction.reply(`Created playlist **${playlistName}**`);
    }
}