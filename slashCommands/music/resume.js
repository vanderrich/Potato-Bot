const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("resume")
        .setDescription("Resume the current track"),
    execute(message, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(false);

        return message.reply(success ? `**${queue.current.title}**, The song continues to play. ✅` : `${message.author}, Something went wrong. ❌`);
    },
};