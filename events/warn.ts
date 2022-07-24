import { Client } from "../Util/types";

module.exports = {
    name: 'warn',
    execute(warning: string, client: Client) {
        console.warn(warning);
        const channel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272");
        if (!channel || !channel.isText()) return;
        channel.send({ content: `<@709950767670493275> Warning: ${warning}!` }); // log the warning to the bot logs channel
    }
}