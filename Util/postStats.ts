import { Client } from 'discord.js';
import axios from 'axios';
import { AutoPoster } from 'topgg-autoposter';

export default async function postStats(client: Client): Promise<void> {
    await axios.post(`https://discord.bots.gg/api/v1/bots/${client.user!.id}/stats/`, {
        headers: {
            "Authorization": process.env.DBOTS_API_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "guildCount": client.guilds.cache.size
        })
    });
    const autoposter = AutoPoster(process.env.TOPGG_API_KEY!, client)
    autoposter.on('posted', (posted: any) => {
        console.log(`[INFO] Posted to top.gg: ${posted.title}`)
    });
    await axios.post(`https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`, {
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
    });
}