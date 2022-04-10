module.exports = {
    name: 'shuffle',
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.shuffle();

        return message.reply(success ? `Shuffled queue ✅` : `${message.author}, Something went wrong ❌`);
    },
};