const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("skiptrack")
        .setDescription("Skip the current track."),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const success = queue.skip();

        return interaction.reply(success ? `**${queue.current.title}**, Skipped track ✅` : `${interaction.user}, Something went wrong ❌`);
    },
};