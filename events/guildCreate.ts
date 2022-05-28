import { Client, Guild, MessageEmbed } from "discord.js"
import { footers } from "../config.json"

module.exports = {
    name: 'guildCreate',
    execute(guild: Guild, client: Client) {
        const channel = client?.guilds?.cache?.get("962861680226865193")?.channels?.cache?.get("979662019202527272")
        if (channel?.type == "GUILD_TEXT")
            channel.send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
        client?.user?.setActivity(`Serving ${client.guilds.cache.size} servers`);
        const welcomeChannel = guild.channels.cache.find(channel => channel.name.includes('welcome')) || guild.channels.cache.find(channel => channel.name.includes('general'))
        if (welcomeChannel?.isText()) {
            const embed = new MessageEmbed()
                .setTitle("Hi!")
                .setDescription("I'm a general purpose bot created by <@!709950767670493275>. Do /help for a list of commands.")
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

            welcomeChannel.send({ embeds: [embed] })
            if (!guild.me?.permissions.has("ADMINISTRATOR")) {
                welcomeChannel.send('Warning: I dont have administrator permissions in this guild. Please give me administrator permissions to use this bot the intended way.')
            }
        }
    }
};