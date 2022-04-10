module.exports = {
    name: 'skip',
    aliases: ['s'],
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.skip();

        return message.reply(success ? `**${queue.current.title}**, Skipped song ✅` : `${message.author}, Something went wrong ❌`);
    },
};