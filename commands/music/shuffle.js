module.exports = {
    name: 'shuffle',
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.shuffle();

        return message.channel.send(success ? `Shuffled queue ✅` : `${message.author}, Something went wrong ❌`);
    },
};