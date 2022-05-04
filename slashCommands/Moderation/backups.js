const { SlashCommandBuilder } = require("@discordjs/builders");
const backup = require("discord-backup");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("backups")
        .setDescription("List all backups"),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    async execute(interaction, client, Discord, footers) {
        const backups = await backup.list();
        const embed = new Discord.MessageEmbed()
            .setTitle("Backups")
            .setDescription("Here are all the backups of this server")
            .setColor('RANDOM')
            .addFields(backups.map(backupID => ({
                name: `Backup ${backupID}`,
                value: '<insert placeholder here>',
            })))
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) });
        interaction.reply({ embeds: [embed] });
    }
}