import { MessageEmbed } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { Client } from "../Util/types";
import fetch from "node-fetch";

module.exports = {
    name: 'error',
    async execute(error: Error, client: Client) {
        console.error(error);
        const id = uuidv4();
        await fetch('https://potato-bot.deno.dev/api/error', {
            body: JSON.stringify({
                name: 'Error',
                id,
                type: "Unknown",
                error: error.toString(),
                stack: error.stack,
            }),
            headers: { Authorization: process.env.SUPER_SECRET_KEY! }
        })
        const logChannel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272")
        if (!logChannel || !logChannel.isText()) return;
        const embed = new MessageEmbed()
            .setAuthor({ name: `Error: ${id}`, url: `https://potato-bot.deno.dev/error/${id}` })
            .addField("Error", error.toString())
            .addField("Stack", error.stack!)
        await logChannel.send({
            content: `<@709950767670493275> you got some debugging to do`,
            embeds: [embed]
        }); // log the error to the bot logs channel
    }
}
