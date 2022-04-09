const { prefix, footers, admins } = require('./../config.json')
const Discord = require('discord.js')
const queue = new Map()
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client, Discord, footers);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}