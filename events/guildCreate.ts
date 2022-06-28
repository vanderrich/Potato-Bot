import { Guild } from "discord.js";
import postStats from "../Util/postStats";
import { Client } from "../Util/types";

module.exports = {
    name: 'guildCreate',
    async execute(guild: Guild, client: Client) {
        const channel = client?.guilds?.cache?.get("962861680226865193")?.channels?.cache?.get("979662019202527272")
        if (channel?.type == "GUILD_TEXT")
            channel.send(`<@709950767670493275> New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
        client.user?.setActivity(`${client.guilds.cache.size} servers`, { type: 'WATCHING' })
        await postStats(client);
    }
};