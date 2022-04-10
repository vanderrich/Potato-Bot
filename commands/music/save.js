module.exports = {
    name: 'save',
    aliases: [],
    category: "Music",
    async execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        message.author.send(`Registered track: **${queue.current.title}** | ${queue.current.author}, Saved server: **${message.guild.name}** ✅`).then(() => {
            message.reply(`I sent the name of the music via private message. ✅`);
        }).catch(error => {
            message.reply(`${message.author}, Unable to send you private message. ❌`);
        });
    },
};