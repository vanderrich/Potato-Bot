module.exports = {
    name: 'resume',
    aliases: [],
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(false);

        return message.reply(success ? `**${queue.current.title}**, The track continues to play. ✅` : `${message.author}, Something went wrong. ❌`);
    },
};