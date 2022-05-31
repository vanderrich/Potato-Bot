import { prefix, footers, admins, settings } from '../config.json'
import Discord from 'discord.js'
const { badWordPresets } = settings
module.exports = {
    name: 'messageCreate',
    async execute(message: Discord.Message, client: any, clientCommands: any) {
        let guildSettings = await client.guildSettings.findOne({ guildId: message.guild?.id })
        if (!guildSettings && message.guild) {
            guildSettings = new client.guildSettings({
                guildID: message.guild?.id,
                badWords: badWordPresets.low,
                welcomeMessage: "",
                welcomeChannel: "",
                welcomeRole: ""
            });
            guildSettings.save();
        }
        for (let i = 0; i < guildSettings.badWords.length; i++) {
            if (message.channel.type === 'DM') break
            let badword
            try {
                badword = message.content.toLowerCase().includes(guildSettings.badWords[i])
            } catch { }
            if (badword) {
                const m = await message.reply('Message contains a word in bad words list')
                message.delete()
                setTimeout(function () { m.delete() }, 5000)
                return
            }
        }

        //check if message is in the autoPublishChannels array
        if (guildSettings.autoPublishChannels.length > 0) {
            console.log(guildSettings.autoPublishChannels)
            if (guildSettings.autoPublishChannels.find((channel: string) => channel === message.channel.id))
                return message.crosspost()
        }


        // client.commands = clientCommands

        if (message.content.substring(0, prefix.length).toLowerCase() == prefix) {
            message.reply("Text commands are deprecated, please use slash (/) commands instead")
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
    }
}