import { SlashCommandBuilder } from "@discordjs/builders";
import backup from "discord-backup";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("backups")
        .setDescription("List all backups"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const backups = await backup.list();
        const embed = new MessageEmbed()
            .setTitle("Backups")
            .setDescription(backups.map(backup => `ID: ${backup}`).join("\n"))
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.reply({ embeds: [embed] });
    }
}