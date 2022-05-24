const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("pause")
        .setDescription("Pause the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(true);

        return interaction.reply(success ? `The currently playing music named **${queue.current.title}** has stopped ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};