const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("save")
        .setDescription("Save the current track to your dms"),
    category: "Music",
    isSubcommand: true,
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        interaction.user.send(`Registered track: **${queue.current.title}** | ${queue.current.user}, Saved server: **${interaction.guild.name}** ✅`).then(() => {
            interaction.reply(`I sent the name of the music via private message. ✅`);
        }).catch(error => {
            interaction.reply(`${interaction.user}, Unable to send you private message. ❌`);
        });
    },
};