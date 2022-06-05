import { SlashCommandBuilder } from "@discordjs/builders";
import backup from "discord-backup";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loadbackup")
        .setDescription("Create a backup of the server")
        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the backup to load")
            .setRequired(true)),
    permissions: "ADMINISTRATOR",
    botPermissions: "ADMINISTRATOR",
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        await interaction.deferReply();
        const backupID = interaction.options.getString("id");
        if (!backupID) {
            return interaction.reply("Please provide a backup ID.");
        }
        backup.load(backupID, interaction.guild).then(() => {
            backup.remove(backupID);
            interaction.editReply("Backup loaded!");
        })
            .catch(err => {
                interaction.editReply("Error loading backup: " + err);
            });
    }
};