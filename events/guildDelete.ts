import { Guild } from "discord.js";
import postStats from "../Util/postStats";
import { Client } from "../Util/types";

module.exports = {
    name: 'guildDelete',
    async execute(guild: Guild, client: Client) {
        const channel = client?.guilds?.cache?.get("962861680226865193")?.channels?.cache?.get("979662019202527272")
        if (channel?.type == "GUILD_TEXT")
            channel.send(`<@709950767670493275> Left guild: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
        client?.user?.setActivity(`Serving ${client.guilds.cache.size} servers`);
        await postStats(client);
    }
};