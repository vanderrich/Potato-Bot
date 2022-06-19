import axios from 'axios';
import { AutoPoster } from 'topgg-autoposter';
import { config } from "dotenv";
import { Client } from './types';
config();

export default async function postStats(client: Client): Promise<void> {
    await axios.post(`https://discord.bots.gg/api/v1/bots/${client.user!.id}/stats/`, {
        "guildCount": client.guilds.cache.size
    }, {
        headers: {
            "Authorization": process.env.DBOTS_API_KEY!,
            "Content-Type": "application/json"
        },
    });
    AutoPoster(process.env.TOPGG_API_KEY!, client)
    await axios.post(`https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`, {
        "guilds": client.guilds.cache.size,
        "users": undefined,
        "voice_connections": client.voice.adapters.size,
        "shard_id": 0,
    }, {
        headers: {
            "Authorization": process.env.DBOTLIST_API_KEY!,
            "Content-Type": "application/json"
        }
    });
}