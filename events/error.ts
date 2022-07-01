import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Client } from "../Util/types";

module.exports = {
    name: 'error',
    async execute(error: Error, client: Client) {
        console.error(error);
        const id = uuidv4();
        await axios.post('https://potato-bot-api.up.railway.app/error', {
            name: 'Error',
            id,
            type: "Unknown",
            error: error.toString(),
            stack: error.stack,
        }, { headers: { Authorization: process.env.SUPER_SECRET_KEY! } })
        const logChannel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272")
        if (!logChannel || !logChannel.isText()) return;
        await logChannel.send({ content: `<@709950767670493275> [Error ${id}](https://potato-bot.netlify.app/status/${id})!` }); // log the error to the bot logs channel
    }
}
