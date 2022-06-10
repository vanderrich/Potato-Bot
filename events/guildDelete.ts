import { Client, Guild } from "discord.js";
import request from "request";

module.exports = {
    name: 'guildDelete',
    execute(guild: Guild, client: Client) {
        const channel = client?.guilds?.cache?.get("962861680226865193")?.channels?.cache?.get("979662019202527272")
        if (channel?.type == "GUILD_TEXT")
            channel.send(`<@709950767670493275> Left guild: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
        client?.user?.setActivity(`Serving ${client.guilds.cache.size} servers`);
        request.post({
            url: "https://discord.bots.gg/api/v1/bots/894060283373449317/stats/",
            headers: {
                "Authorization": process.env.DBOTS_API_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "guildCount": client.guilds.cache.size
            })
        });
        request.post({
            url: "https://top.gg/api/bots/894060283373449317/stats",
            headers: {
                "Authorization": process.env.TOPGG_API_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "server_count": client.guilds.cache.size
            })
        });
        request.post({
            url: "https://discordbotlist.com/api/v1/bots/894060283373449317/stats",
            headers: {
                "Authorization": process.env.DBOTLIST_API_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "guilds": client.guilds.cache.size,
                "users": client.users.cache.size
            })
        });
    }
};