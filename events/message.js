const {prefix} = require('./../config.json')
const Discord = require('discord.js') 
const queue = new Map()
module.exports = {
    name: 'message',
    execute(message, client, clientCommands) {
        const serverQueue = queue.get(message.guild.id);

        client.commands = clientCommands

        if (message.content.substring(0, prefix.length) !== prefix) {
            return
        }
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;
        if (message.author.id == client.id) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

            if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.permissions)) {
                    return message.reply('You have no permission to run that command!');
                }
            }

            if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
            }

            const { cooldowns } = client;

            if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            try {
                command.execute(message, args, commandName, client, Discord);
            } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}