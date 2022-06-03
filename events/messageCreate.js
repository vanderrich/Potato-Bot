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
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config.json");
const { badWordPresets } = config_json_1.settings;
module.exports = {
    name: 'messageCreate',
    execute(message, client, clientCommands) {
        return __awaiter(this, void 0, void 0, function* () {
            let guildSettings = yield client.guildSettings.findOne({ guildId: message.guildId });
            for (let i = 0; i < (guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.badWords.length); i++) {
                if (message.channel.type === 'DM')
                    break;
                let badword;
                try {
                    badword = message.content.toLowerCase().includes(guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.badWords[i]);
                }
                catch (_a) { }
                if (badword) {
                    const m = yield message.reply('Message contains a word in bad words list');
                    message.delete();
                    setTimeout(function () { m.delete(); }, 5000);
                    return;
                }
            }
            //check if message is in the autoPublishChannels array
            if ((guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.autoPublishChannels.length) > 0) {
                console.log(guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.autoPublishChannels);
                if (guildSettings === null || guildSettings === void 0 ? void 0 : guildSettings.autoPublishChannels.find((channel) => channel === message.channel.id))
                    return message.crosspost();
            }
            // client.commands = clientCommands
            if (message.content.substring(0, config_json_1.prefix.length).toLowerCase() == config_json_1.prefix) {
                message.reply("Text commands are deprecated, please use slash (/) commands instead");
            }
            // const args = message.content.slice(prefix.length).trim().split(/ +/);
            // const commandName = args.shift().toLowerCase();
            // const command = client.commands.get(commandName)
            //     || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            // if (!command) return;
            // if (message.author.id == client.id) return;
            // if (command.guildOnly && message.channel.type === 'dm') {
            //     return message.reply('I can\'t execute that command inside DMs!');
            // }
            // if (command.permissions) {
            //     const authorPerms = message.channel.permissionsFor(message.author);
            //     if (!authorPerms || !authorPerms.has(command.permissions)) {
            //         return message.reply('You have no permission to run that command!');
            //     }
            // }
            // if (command.category == "Bot Admin Only" && !admins.includes(message.author.id)) {
            //     return message.reply('You have no permission to run that command! only the bot admins can run this command\nBot Admins ID: ' + admins.join(', '));
            // }
            // if (command.args && !args.length) {
            //     let reply = `You didn't provide any arguments, ${message.author}!`;
            //     if (command.usage) {
            //         reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            //     }
            //     return message.reply(reply);
            // }
            // const { cooldowns } = client;
            // if (!cooldowns.has(command.name)) {
            //     cooldowns.set(command.name, new Discord.Collection());
            // }
            // if (message.author.bot) return;
            // const now = Date.now();
            // const timestamps = cooldowns.get(command.name);
            // const cooldownAmount = (command.cooldown || 3) * 1000;
            // if (timestamps.has(message.author.id)) {
            //     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            //     if (now < expirationTime) {
            //         const timeLeft = (expirationTime - now) / 1000;
            //         return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            //     }
            // }
            // timestamps.set(message.author.id, now);
            // setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            // try {
            //     command.execute(message, args, commandName, client, Discord, footers);
            // } catch (error) {
            //     console.error(error);
            //     message.reply('There was an error trying to execute that command!\n' + error);
            // }
        });
    }
};
