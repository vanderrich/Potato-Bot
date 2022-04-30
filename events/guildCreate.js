const { MessageEmbed } = require("discord.js");
const { footers } = require("../config.json");

module.exports = {
    name: 'guildCreate',
    execute(guild, client) {
        console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
        client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
        console.log(client.guilds.cache)
        const welcomeChannel = guild.channels.cache.find(channel => channel.name.includes('welcome')) || guild.channels.cache.find(channel => channel.name.includes('general'))
        if (welcomeChannel) {
            const embed = new MessageEmbed()
                .setTitle('Hi!')
                .setDescription(`I'm ${client.user.username}! I'm a bot created by <@709950767670493275>! Do /help for more info.`)
                .setThumbnail(client.user.avatarURL())
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: guild.iconURL({ dynamic: true }) })
            welcomeChannel.send({ embeds: [embed] })
            if (!guild.me.permissions.has("ADMINISTRATOR")) {
                welcomeChannel.send('Warning: I dont have administrator permissions in this guild. Please give me administrator permissions to use this bot the intended way.')
            }
        }
    }
};