import { CategoryChannel, Client, DiscordAPIError, TextChannel } from 'discord.js';
import request from 'request';

export default function postStats(client: Client): void {
    request.post({
        url: `https://discord.bots.gg/api/v1/bots/${client.user!.id}/stats/`,
        headers: {
            "Authorization": process.env.DBOTS_API_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "guildCount": client.guilds.cache.size
        })
    }, (err: any, res: any, body: any) => {
        if (err) console.error(err);
        client.users.cache.get("709950767670493275")?.send(`res: ${res}\n body: ${body}`)
    });
    request.post({
        url: `https://top.gg/api/bots/${client.user!.id}/stats`,
        headers: {
            "Authorization": process.env.TOPGG_API_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "server_count": client.guilds.cache.size,
            "shards": [],
            "shard_count": 1
        })
    }, (err: any, res: any, body: any) => {
        if (err) console.error(err);
        client.users.cache.get("709950767670493275")?.send(`res: ${res}\n body: ${body}`)
    });
    request.post({
        url: `https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`,
        headers: {
            "Authorization": process.env.DBOTLIST_API_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "guilds": client.guilds.cache.size,
            "users": client.users.cache.size,
            "voice_connections": client.voice.adapters.size,
            "shard_id": 0,
        })
    }, (err: any, res: any, body: any) => {
        if (err) console.error(err);
        client.users.cache.get("709950767670493275")?.send(`res: ${res}\n body: ${body}`)
    });
    console.log(`[INFO] ${client.guilds.cache.size} guild(s) found`)
    client.users.cache.get("709950767670493275")?.send(`[INFO] ${client.guilds.cache.size} guild(s) found`)
}