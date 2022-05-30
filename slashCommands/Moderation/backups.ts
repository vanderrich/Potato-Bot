import { SlashCommandBuilder } from "@discordjs/builders";
import backup from "discord-backup";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("backups")
        .setDescription("List all backups"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const backups = await backup.list();
        const embed = new MessageEmbed()
            .setTitle("Backups")
            .setDescription("Here are all the backups of this server")
            .setColor('RANDOM')
            .addFields(backups.map(backupID => ({
                name: `Backup ${backupID}`,
                value: '<insert placeholder here>',
            })))
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.reply({ embeds: [embed] });
    }
}