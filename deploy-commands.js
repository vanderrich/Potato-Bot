const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');

async function deploy() {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    const slashCommandFolders = fs.readdirSync('./slashCommands');
    for (const folder of slashCommandFolders) {
        //loops through all folders of commandFolders
        const commandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            //loops through all the commandFiles and add them to the client commands collection
            const command = require(`./slashCommands/${folder}/${file}`);
            if (!command.data) continue;
            commands.push(command.data.toJSON());
        }
    }

    console.log(commands)

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands('954584325809123348', '954193160932847646'),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}
module.exports = deploy;