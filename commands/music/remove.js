module.exports = {
    name: 'remove',
    aliases: [],
    category: "Music",
    async execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);
        let index;
        try {
            index = parseInt(args[0]) - 1
            queue.remove(index)
        } catch {
            return message.reply(`No music found at ${index + 1}`)
        }
        message.reply(`Removed the music at ${index + 1} from the queue... ✅`);
    },
};