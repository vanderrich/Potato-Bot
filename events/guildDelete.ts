import { Client, Guild } from "discord.js";

module.exports = {
    name: 'guildDelete',
    execute(guild: Guild, client: Client) {
        const channel = client?.guilds?.cache?.get("962861680226865193")?.channels?.cache?.get("979662019202527272")
        if (channel?.type == "GUILD_TEXT")
            channel.send(`Left guild: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
        client?.user?.setActivity(`Serving ${client.guilds.cache.size} servers`);
    }
};