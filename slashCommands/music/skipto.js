const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("skipto")
        .setDescription("Skip to a specific track in the queue, removing other tracks on the way.")
        .addIntegerOption(option => option
            .setName("index")
            .setDescription("The index of the track to skip to.")
            .setRequired(true)
    ),
    category: "Music",
    isSubcommand: true,
    execute(message, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        let index = message.options.getInteger('index') - 1;

        if (index < 0) message.reply("Index cant be a negative number! ❌");

        queue.skipTo(index);

        return message.reply(`Skipped songs ✅`);
    },
};