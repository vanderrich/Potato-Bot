module.exports = {
    name: 'remove',
    aliases: [],

    async execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);
        let index;
        try {
            index = parseInt(args[0]) - 1
            queue.remove(index)
        } catch {
            return message.channel.send(`No music found at ${index + 1}`)
        }
        message.channel.send(`Removed the music at ${index + 1} from the queue... ✅`);
    },
};