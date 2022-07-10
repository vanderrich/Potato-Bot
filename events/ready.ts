import { User } from "discord.js"
import postStats from "../Util/postStats";
import { Client } from "../Util/types";

module.exports = {
    name: 'ready',
    async execute(client: Client) {
        console.log('Ready!')
        client.user?.setActivity(`${client.guilds.cache.size} servers`, { type: 'WATCHING' })
        client.birthdays.find({}).then((birthdays: any) => {
            if (birthdays.length > 0) {
                console.log(`[INFO] ${birthdays.length} birthday(s) found`)
                birthdays.forEach((birthday: any) => {
                    if (birthday.birthday.getTime() < new Date().getTime()) {
                        client.birthdays.updateOne({ userId: birthday.userId }, {
                            $set: {
                                birthday: new Date(new Date().getFullYear() + 1, birthday.birthday.getMonth(), birthday.birthday.getDate())
                            }
                        })
                        client.users.fetch(birthday.userId).then((user: User) => {
                            if (user) {
                                user.send(`Happy Birthday!`)
                                client.birthdayConfigs.findOne({ guildId: birthday.guildId }).then((config: any) => {
                                    if (config && config.channelId) {
                                        const channel = client.channels.cache.get(config.channelId)
                                        if (!channel || !channel.isText()) return;
                                        channel.send(eval('`' + config.message + '`') || `Its <@${user.id}>'s birthday!`)
                                    }
                                });
                            }
                        })
                    }
                })
            }
        });
        setInterval(async () => {
            fetch('https://potato-bot.deno.dev/api/status', { method: 'POST' })
                .catch(error => {
                    console.error(error);
                }).then(async (res: void | Response) => {
                    if (!res) return;
                    const data = await res.json()
                    if (res.status !== 200) console.error(`Error in pinging the api: ${data.message}`);

                    data.newVotes.forEach((vote: any) => {
                        const channel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272");
                        if (!channel || !channel.isText()) return
                        channel.send({ content: `<@${vote.user}> voted for this bot on ${vote.source}!`, allowedMentions: { users: [] } })
                    })
                })
        }, 15000)
        await postStats(client);
    }
}