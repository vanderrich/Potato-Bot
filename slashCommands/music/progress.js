const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("progress")
        .setDescription("See the current track progress"),
    category: "Music",
    isSubcommand: true,
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const progress = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        if (timestamp.progress == 'Infinity') return interaction.reply(`This song is live streaming, no duration data to display. 🎧`);

        interaction.reply(`${progress} (**${timestamp.progress}**%)`);
    },
};