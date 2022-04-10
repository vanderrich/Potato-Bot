module.exports = {
    name: 'back',
    aliases: [],
    category: "Music",
    async execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, No music currently playing! ❌`);

        if (!queue.previousTracks[1]) return message.reply(`${message.author}, There was no music playing before ❌`);

        await queue.back();

        message.reply(`Previous music started playing... ✅`);
    },
};