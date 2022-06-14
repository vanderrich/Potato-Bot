import axios from "axios";
import { uuidv4 } from 'uuid';

module.exports = {
    name: 'error',
    async execute(error: Error, client: any) {
        console.error(error);
        const id = uuidv4();
        await axios.post('https://potato-bot-api.herokuapp.com/error', {
            name: 'Error',
            id,
            type: "Select Menu",
            error: error.toString(),
            stack: error.stack,
        }, { headers: { Authorization: process.env.SUPER_SECRET_KEY! } })
        await client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `<@709950767670493275> [Error ${id}](https://potato-bot.netlify.app/status/${id})!` }); // log the error to the bot logs channel
    }
}
