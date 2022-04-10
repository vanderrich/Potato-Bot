module.exports = {
    name: "loop",
    description: "Loop the song or queue or autoplay",
    aliases: [],
    usage: "loop [off|song|queue|autoplay]",
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);
        switch (args[0]) {
            case "off":
                queue.setRepeatMode(0)
                message.reply("🔁 Loop off")
                break;
            case "song":
                queue.setRepeatMode(1)
                message.reply("🔁 Looping song")
                break;
            case "queue":
                queue.setRepeatMode(0)
                message.reply("🔁 Looping queue")
                break;
            case "autoplay":
                queue.setRepeatMode(0)
                message.reply("🔁 Autoplaying")
                break;

            default:
                message.reply("Not a valid option, either off song queue or autoplay")
                break;
        }
    }
}