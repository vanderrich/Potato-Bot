const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("skip")
        .setDescription("Skip the current track."),
    category: "Music",
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const success = queue.skip();

        return interaction.reply(success ? `**${queue.current.title}**, Skipped song ✅` : `${interaction.user}, Something went wrong ❌`);
    },
};