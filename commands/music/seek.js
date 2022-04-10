module.exports = {
    name: 'seek',
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        let pos = parseInt(args[0]);

        if (pos === NaN) return message.reply(`${message.author}, Please provide a valid number! ❌`);

        const success = queue.seek(pos);

        return message.reply(success ? `Seeked to ${pos} ✅` : `${message.author}, Something went wrong ❌`);
    },
};