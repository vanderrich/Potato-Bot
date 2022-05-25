const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addfakemember")
        .setDescription("Adds a fake member to the server"),
    execute(interaction, client) {
        client.emit("guildMemberAdd", interaction.member);
        interaction.reply("Added fake member");
    }
}