const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');

function deploy() {

    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    const slashCommandFolders = fs.readdirSync('./slashCommands');
    for (const folder of slashCommandFolders) {
        //loops through all folders of commandFolders
        const commandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            //loops through all the commandFiles and add them to the client commands collection
            const command = require(`./slashCommands/${folder}/${file}`);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationCommands('954584325809123348'), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}
module.exports = deploy;