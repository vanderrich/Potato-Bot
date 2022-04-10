module.exports = {
    name: 'pause',
    aliases: [],
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(true);

        return message.reply(success ? `The currently playing music named **${queue.current.title}** has stopped ✅` : `${message.author}, Something went wrong. ❌`);
    },
};