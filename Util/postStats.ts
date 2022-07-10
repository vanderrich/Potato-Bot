import { AutoPoster } from 'topgg-autoposter';
import { config } from "dotenv";
import { Client } from './types';
import fetch from 'node-fetch';
config();

export default async function postStats(client: Client): Promise<void> {
    if (!process.env.DBOTLIST_API_KEY) return console.log("No discordbotlist.com API Key found.");
    if (!process.env.DBOTS_API_KEY) return console.log("No discord.bots.gg API key found.");
    if (!process.env.TOPGG_API_KEY) return console.log("No top.gg API key found.");
    await fetch(`https://discord.bots.gg/api/v1/bots/${client.user!.id}/stats/`, {
        body: JSON.stringify({
            guildCount: client.guilds.cache.size
        }),
        method: 'POST',
        headers: {
            Authorization: process.env.DBOTS_API_KEY!
        }
    }).catch(err => console.error(err)).then(() => console.log("Posted to discord.bots.gg"));
    AutoPoster(process.env.TOPGG_API_KEY, client)
    await fetch(`https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`, {
        body: JSON.stringify({
            guilds: client.guilds.cache.size,
            users: undefined,
            voice_connections: client.voice.adapters.size,
            shard_id: 0,
        }),
        method: 'POST',
        headers: {
            "Authorization": process.env.DBOTLIST_API_KEY,
            "Content-Type": "application/json"
        }
    }).catch(err => console.error(err)).then(() => console.log("Posted to discordbotlist.com"));
}