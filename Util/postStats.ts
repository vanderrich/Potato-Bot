import { Client } from 'discord.js';
import axios from 'axios';
import { AutoPoster } from 'topgg-autoposter';

export default async function postStats(client: Client): Promise<void> {
    await axios.post(`https://discord.bots.gg/api/v1/bots/${client.user!.id}/stats/`, {
        "guildCount": client.guilds.cache.size
    }, {
        headers: {
            "Authorization": process.env.DBOTS_API_KEY!,
            "Content-Type": "application/json"
        },
    });
    const autoposter = AutoPoster(process.env.TOPGG_API_KEY!, client)
    autoposter.on('posted', (posted: any) => {
        client.users.cache.get("709950767670493275")?.send(`[INFO] Posted to top.gg: ${posted.title}`)
    });
    autoposter.on('error', (err: any) => {
        console.error(err);
    });
    await axios.post(`https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`, {
        "guilds": client.guilds.cache.size,
        "users": client.users.cache.size,
        "voice_connections": client.voice.adapters.size,
        "shard_id": 0,
    }, {
        headers: {
            "Authorization": process.env.DBOTLIST_API_KEY!,
            "Content-Type": "application/json"
        }
    });
}