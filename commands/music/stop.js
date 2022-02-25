module.exports = {
    name: 'stop',
    aliases: ['st'],
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        queue.destroy();

        message.channel.send(`The music playing on this server has been turned off, see you next time ✅`);
    },
};