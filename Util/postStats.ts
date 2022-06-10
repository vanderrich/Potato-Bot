import { Client } from 'discord.js';
import request from 'request';
import { AutoPoster } from 'topgg-autoposter';

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
    const autoposter = AutoPoster(process.env.TOPGG_API_KEY!, client)
    autoposter.on('posted', (posted: any) => {
        console.log(`[INFO] Posted to top.gg: ${posted.title}`)
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