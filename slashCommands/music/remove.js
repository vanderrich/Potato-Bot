const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove a track from the queue")
        .addIntegerOption(option => option
            .setName("index")
            .setDescription("The index of the track to remove.")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        const success = queue.removeTrack(interaction.options.getInteger('index'));
        return interaction.reply(success ? `Removed track from queue! ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};