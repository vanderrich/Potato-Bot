const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("shufflequeue")
        .setDescription("Shuffle the current queue."),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        let success;
        for (let i = queue.tracks.length - 1; i > 0; i--) {
            success = success && queue.shuffle();
        }

        return interaction.reply(success ? `Shuffled queue ✅` : `${interaction.user}, Something went wrong ❌`);
    },
};