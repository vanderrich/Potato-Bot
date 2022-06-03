import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Client } from 'discord.js';
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

export const deploy = async (client: Client) => {
    if (!token) return console.error("No token found");
    const commands: Array<string> = [];
    const slashCommandFolders = fs.readdirSync('./slashCommands');
    for (const folder of slashCommandFolders) {
        //loops through all folders of commandFolders
        const commandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            //loops through all the commandFiles and add them to the client commands collection
            const command = require(`./slashCommands/${folder}/${file}`);
            if (!command.data || command.isSubcommand) continue;
            if (command.contextMenu) commands.push(command.contextMenu.toJSON());
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');
        // test bot
        if (clientId == '954584325809123348' || clientId == '982231580363853875') {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, 5000);
            });
            client.guilds.cache.forEach(async (guild) => {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guild.id),
                    { body: commands },
                );
            });
        }
        // stable
        else if (clientId == '894060283373449317') {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
        }

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}