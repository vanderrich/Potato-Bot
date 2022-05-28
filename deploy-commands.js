"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const fs_1 = __importDefault(require("fs"));
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const deploy = async (client) => {
    if (!token)
        return console.error("No token found");
    const commands = [];
    const slashCommandFolders = fs_1.default.readdirSync('./slashCommands');
    for (const folder of slashCommandFolders) {
        //loops through all folders of commandFolders
        const commandFiles = fs_1.default.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            //loops through all the commandFiles and add them to the client commands collection
            const command = require(`./slashCommands/${folder}/${file}`);
            if (!command.data || command.isSubcommand)
                continue;
            if (command.contextMenu)
                commands.push(command.contextMenu.toJSON());
            commands.push(command.data.toJSON());
        }
    }
    const rest = new rest_1.REST({ version: '9' }).setToken(token);
    try {
        console.log('Started refreshing application (/) commands.');
        // test bot
        if (clientId == '954584325809123348') {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(null);
                }, 5000);
            });
            client.guilds.cache.forEach(async (guild) => {
                await rest.put(v9_1.Routes.applicationGuildCommands(clientId, guild.id), { body: commands });
            });
        }
        // stable
        else if (clientId == '894060283373449317') {
            await rest.put(v9_1.Routes.applicationCommands(clientId), { body: commands });
        }
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
};
exports.deploy = deploy;
