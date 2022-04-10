const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("stop")
        .setDescription("Stop the current track."),
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        queue.destroy();

        interaction.reply(`The music playing on this server has been turned off, see you next time ✅`);
    },
};