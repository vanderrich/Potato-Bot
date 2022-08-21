import { AutoPoster } from 'topgg-autoposter';
import { Client } from './types';
import { config } from 'dotenv';
import fetch from "node-fetch";
config();

export default async function postStats(client: Client): Promise<void> {
    if (!process.env.DBOTLIST_API_KEY) return console.log("No discordbotlist.com API Key found.");
    if (!process.env.DBOTS_API_KEY) return console.log("No discord.bots.gg API key found.");
    if (!process.env.TOPGG_API_KEY) return console.log("No top.gg API key found.");
    if (process.env.CLIENT_ID !== '894060283373449317') return
    fetch(`https://discord.bots.gg/api/v1/bots/${client.user!.id}/stats/`, {
        body: JSON.stringify({
            guildCount: client.guilds.cache.size
        }),
        method: 'POST',
        headers: {
            Authorization: process.env.DBOTS_API_KEY!
        }
    }).catch(err => console.error(err)).then((res) => {
        console.log(res);
        console.log("Posted to discord.bots.gg")
    });
    AutoPoster(process.env.TOPGG_API_KEY, client).on('posted', () => {
        console.log("Posted to top.gg");
    }).on('error', (err: any) => {
        console.error(err);
    });
    fetch(`https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`, {
        body: JSON.stringify({
            guilds: client.guilds.cache.size,
            voice_connections: client.voice.adapters.size,
            shard_id: 0,
        }),
        method: 'POST',
        headers: {
            Authorization: process.env.DBOTLIST_API_KEY,
        }
    })
        .catch(err => console.error(err))
        .then((res) => {
            console.log(res);
            console.log("Posted to discordbotlist.com")
        });
    fetch(`https://api.discordlist.gg/v0/bots/${client.user!.id}/guilds`, {
        body: JSON.stringify({
            count: client.guilds.cache.size,
        }),
        method: 'PUT',
        headers: {
            Authorization: process.env.DLIST_API_KEY!,
        }
    })
        .catch(err => console.error(err))
        .then((res) => {
            console.log(res);
            console.log("Posted to discordlist.gg")
        })
}