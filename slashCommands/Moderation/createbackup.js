const { SlashCommandBuilder } = require("@discordjs/builders");
const backup = require("discord-backup");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createbackup")
        .setDescription("Create a backup of the server"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    async execute(interaction) {
        interaction.deferReply();
        backup.create(interaction.guild).then((backupData) => {
            interaction.editReply("Backup created! ID: " + backupData.id);
        }).catch(err => {
            interaction.editReply("Error creating backup: " + err);
        });
    }
};