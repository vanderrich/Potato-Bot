const { SlashCommandBuilder } = require("@discordjs/builders");
const backup = require("discord-backup");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removebackup")
        .setDescription("Remove a backup")
        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the backup to load")
            .setRequired(true)),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    async execute(interaction) {
        interaction.deferReply();
        const backupID = interaction.options.getString("id");
        backup.remove(backupID)
            .then(() => { interaction.editReply("Backup removed!") })
            .catch(err => { interaction.editReply("Error removing backup: " + err) });
    }
};