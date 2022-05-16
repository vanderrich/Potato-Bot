const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("seek")
        .setDescription("Seek to a specific time in the current track")
        .addIntegerOption(option => option
            .setName("pos")
            .setDescription("The position to seek to.")
            .setRequired(true)
    ),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        let pos = interaction.options.getInteger('pos');

        const success = queue.seek(pos);

        return interaction.reply(success ? `Seeked to ${pos} ✅` : `${interaction.user}, Something went wrong ❌`);
    },
};