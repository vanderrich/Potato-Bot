"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const fs_1 = __importDefault(require("fs"));
const config_json_1 = require("../../config.json");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option => option
        .setName('command')
        .setDescription('The command to reload.')
        .setRequired(true)),
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_json_1.admins.includes(interaction.user.id))
                return;
            //variables
            const commandName = interaction.options.getString('command');
            const command = client.slashCommands.get(commandName)
                || client.slashCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
            const commandFolders = fs_1.default.readdirSync('./slashCommands');
            //conditions
            if (!command)
                return interaction.reply(`There is no command with name or alias \`${commandName}\`, ${interaction.user}!`);
            const folderName = commandFolders.find(folder => fs_1.default.readdirSync(`./slashCommands/${folder}`).includes(`${command.data.name}.js`));
            delete require.cache[require.resolve(`../${folderName}/${command.data.name}.js`)];
            try {
                const newCommand = require(`../${folderName}/${command.data.name}.js`);
                client.slashCommands.set(newCommand.name, newCommand);
                interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
            }
            catch (error) {
                console.error(error);
                interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error}\``);
            }
        });
    },
};
