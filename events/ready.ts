import { User } from "discord.js"
import postStats from "../Util/postStats";
import { Birthday, Client } from "../Util/types";
import fetch from "node-fetch";

module.exports = {
    name: 'ready',
    async execute(client: Client) {
        console.log('Ready!')
        client.user?.setActivity(`${client.guilds.cache.size} servers`, { type: 'WATCHING' })
        client.birthdays.find({}).then(birthdays => {
            if (birthdays.length > 0) {
                birthdays.forEach((birthday: Birthday) => {
                    if (birthday.birthday.getDate() == new Date().getDate() && birthday.birthday.getMonth() == new Date().getMonth() && !birthday.haveCelebratedYears.includes(new Date().getFullYear())) {
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
                }).then(async (res) => {
                    if (!res) return;
                    const dataRaw = await res.json()
                    const data = JSON.parse(dataRaw)
                    if (res.status !== 200) console.error(`Error in pinging the api: ${data.message}`);
                    console.log(res, data);
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