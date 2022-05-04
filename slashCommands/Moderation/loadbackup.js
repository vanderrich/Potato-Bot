const { SlashCommandBuilder } = require("@discordjs/builders");
const backup = require("discord-backup");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loadbackup")
        .setDescription("Create a backup of the server")
        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the backup to load")
            .setRequired(true)),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    async execute(interaction) {
        interaction.deferReply();
        const backupID = interaction.options.getString("id");
        backup.load(backupID, interaction.guild).then(() => {
            backup.remove(backupID);
            interaction.editReply("Backup loaded!");
        })
            .catch(err => {
                interaction.editReply("Error loading backup: " + err);
            });
    }
};