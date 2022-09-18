import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'fs';
import { admins } from '../../config.json';
import { SlashCommand } from '../../Util/types';
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)
        ) as SlashCommandBuilder,
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    async execute(interaction, client) {
        if (!admins.includes(interaction.user.id)) return;
        //variables
        const commandName = interaction.options.getString('command')!;
        const command = client.slashCommands.get(commandName)
            || client.slashCommands.find((cmd: any) => cmd.aliases && cmd.aliases.includes(commandName));
        const commandFolders = fs.readdirSync('./slashCommands');

        //conditions
        if (!command) return interaction.reply(`There is no command with name or alias \`${commandName}\`, ${interaction.user}!`);
        const folderName = commandFolders.find(folder =>
            fs.readdirSync(`./slashCommands/${folder}`).includes(`${command.data.name}.js`));
        delete require.cache[require.resolve(`../${folderName}/${command.data.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.data.name}.js`);
            client.slashCommands.set(newCommand.name, newCommand);
            interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error: any) {
            console.error(error);
            interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error}\``);
        }
    },
} as SlashCommand;