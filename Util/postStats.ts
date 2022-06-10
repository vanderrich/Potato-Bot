import { Client } from 'discord.js';
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
    }, (err: any) => { console.error(err) });
    request.post({
        url: `https://top.gg/api/bots/${client.user!.id}/stats`,
        headers: {
            "Authorization": process.env.TOPGG_API_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "server_count": client.guilds.cache.size
        })
    }, (err: any) => { console.error(err) });
    request.post({
        url: `https://discordbotlist.com/api/v1/bots/${client.user!.id}/stats`,
        headers: {
            "Authorization": process.env.DBOTLIST_API_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "guilds": client.guilds.cache.size,
            "users": client.users.cache.size
        })
    }, (err: any) => { console.error(err) });
}