const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the current queue."),
    category: "Music",
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const success = queue.shuffle();

        return interaction.reply(success ? `Shuffled queue ✅` : `${interaction.user}, Something went wrong ❌`);
    },
};