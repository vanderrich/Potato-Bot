const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("loop")
        .setDescription("Loop the track or queue")
        .addStringOption(option =>
            option
                .setName("loop")
                .setDescription("The object to loop")
                .setRequired(true)
                .addChoice("No loop", "off")
                .addChoice("Loop the track", "track")
                .addChoice("Loop the entire queue", "queue")
                .addChoice("autoplay", "autoplay")
        ),
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);
        switch (interaction.options.getString("loop")) {
            case "off":
                queue.setRepeatMode(0)
                interaction.reply("🔁 Loop off")
                break;
            case "track":
                queue.setRepeatMode(1)
                interaction.reply("🔁 Looping track")
                break;
            case "queue":
                queue.setRepeatMode(2)
                interaction.reply("🔁 Looping queue")
                break;
            case "autoplay":
                queue.setRepeatMode(3)
                interaction.reply("🔁 Autoplaying")
                break;
        }
    }
}