module.exports = {
    name: 'clear',
    aliases: [],
    category: "Music",
    async execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, No music currently playing. ❌`);

        if (!queue.tracks[0]) return message.reply(`${message.author}, There is already no music in queue after the current one ❌`);

        await queue.clear();

        message.reply(`The queue has just been cleared. 🗑️`);
    },
};