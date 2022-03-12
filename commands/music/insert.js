const { QueryType } = require('discord-player');
module.exports = {
    name: "insert",
    aliases: ["i"],
    category: "Music",
    async execute(message, args, cmd, client, Discord) {
        if (!args[0]) return message.channel.send(`${message.author}, Write the name of the music you want to search. ❌`);
        const res = await client.player.search(args.join(' '), {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.channel.send(`${message.author}, No results found! ❌`);

        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel
        });

        try {
            if (!queue.connection) return message.channel.send("Queue not found ❌")
        } catch {
            await client.player.deleteQueue(message.guild.id);
            return message.channel.send(`${message.author}, I can't join audio channel. ❌`);
        }

        await message.channel.send(`Your Track Loading... 🎧`);

        queue.insert(res.tracks[0], parseInt(args[args.length - 1]));
    }
}