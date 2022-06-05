import { SlashCommandBuilder } from "@discordjs/builders";
import backup from "discord-backup";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createbackup")
        .setDescription("Create a backup of the server"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction) {
        interaction.deferReply();
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        backup.create(interaction.guild).then((backupData) => {
            interaction.editReply("Backup created! ID: " + backupData.id);
        }).catch(err => {
            interaction.editReply("Error creating backup: " + err);
        });
    }
};