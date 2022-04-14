const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

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

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
<<<<<<< HEAD
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
=======
            Routes.applicationCommands(clientId),
>>>>>>> aa406aed6a401b315bd260b39b70d472cebfef8e
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}
module.exports = deploy;