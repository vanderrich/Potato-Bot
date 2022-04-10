const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("clear")
        .setDescription("Clear the queue."),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, No music currently playing. ❌`);

        if (!queue.tracks[0]) return interaction.reply(`${interaction.user}, There is already no music in queue after the current one ❌`);

        await queue.clear();

        interaction.reply(`The queue has just been cleared. 🗑️`);
    },
};