import { SlashCommandBuilder } from "@discordjs/builders";
import backup from "discord-backup";
import { CommandInteraction } from "discord.js";

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
    async execute(interaction: CommandInteraction) {
        interaction.deferReply();
        const backupID = interaction.options.getString("id");
        if (!backupID) return interaction.reply("Please provide a backup ID.");
        backup.remove(backupID)
            .then(() => { interaction.editReply("Backup removed!") })
            .catch(err => { interaction.editReply("Error removing backup: " + err) });
    }
};