const { admins } = require("../../config.json")
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteuser')
        .setDescription('Delete a user from the database.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user to delete.')
                .setRequired(true)
        ),
    permissions: "BotAdmin",
    execute(interaction, client, Discord, footers) {
        if (!admins.includes(interaction.user.id)) return; // return if author isn't bot owner
        let user = interaction.options.getUser('target');
        client.eco.delete(user.id);

        const embed = new Discord.MessageEmbed()
            .setTitle(`User Deleted`)
            .setDescription(`User: ${user}\n`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        return interaction.reply({ embeds: [embed] })

    }
}