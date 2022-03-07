module.exports = {
    name: 'skipto',
    aliases: ['sto'],
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        let index;
        try {
            index = parseInt(args[0]) - 1
        } catch (error) {
            return message.channel.send("Index given is not a number")
        }

        queue.skipTo(index);

        return message.channel.send(`Skipped songs ✅`);
    },
};