const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("loop")
        .setDescription("Loop the track or queue")
        .addNumberOption(option =>
            option
                .setName("loop")
                .setDescription("The object to loop")
                .setRequired(true)
                .addChoice("No loop", 0)
                .addChoice("Loop the track", 1)
                .addChoice("Loop the entire queue", 2)
                .addChoice("autoplay", 3)
    ),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);
        const loop = interaction.options.getNumber("loop");
        queue.setRepeatMode(loop);
        interaction.reply(`${loop === 0 ? "Off" : loop === 1 ? "Looping track 🔂" : loop === 2 ? "Looping queue 🔁" : "Autoplaying 🔂"}`);
    }
}