module.exports = {
    name: 'seek',
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        let pos;
        try {
            pos = parseInt(args[0])
        } catch (error) {
            return message.channel.send("Position given is not a number")
        }

        const success = queue.seek(pos);

        return message.channel.send(success ? `Seeked to ${pos} ✅` : `${message.author}, Something went wrong ❌`);
    },
};