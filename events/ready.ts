import { User } from "discord.js"
import postStats from "../Util/postStats";
import { Birthday, Client, Event } from "../Util/types";
import fetch from "node-fetch";
import { setupSubscriptionsTwitter } from "../Util/setupSubscriptions";
import throwError from "../Util/error";
import { config } from "dotenv";
config()

module.exports = {
    name: 'ready',
    async execute(client: Client) {
        if (process.env.CLIENT_ID == "894060283373449317")
            setupSubscriptionsTwitter(client)
        client.user?.setActivity(`${client.guilds.cache.size} servers`, { type: 'WATCHING' })
        setInterval(() => { checkBdays(client) }, 1000 * 60 * 60 * 24); checkBdays(client)
        setInterval(async () => {
            fetch('https://potato-bot.deno.dev/api/status', { method: 'POST' })
                .catch(error => {
                    throwError(error, client);
                }).then(async (res) => {
                    if (!res) return;
                    const data = await res.json()
                    if (res.status !== 200) throwError(new Error(`Error in pinging the api: ${data.message}`), client);
                    data.newVotes.forEach((vote: any) => {
                        const channel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272");
                        if (!channel || !channel.isText()) return
                        console.log(vote)
                        channel.send({ content: `<@${vote.user}> voted for this bot on ${vote.source}!`, allowedMentions: { users: [] } })
                    })
                })
        }, 15000)
        await postStats(client);
        console.info('Ready!')
    }
} as Event;

const checkBdays = (client: Client) => {
    client.birthdays.find({}).then(birthdays => {
        if (birthdays.length > 0) {
            birthdays.forEach((birthday: Birthday) => {
                birthday.birthday.setFullYear(new Date().getFullYear() + 1)
                if (birthday.birthday.getDate() == new Date().getDate() && birthday.birthday.getMonth() == new Date().getMonth() && !birthday.haveCelebratedYears.includes(new Date().getFullYear())) {
                    client.birthdays.updateOne({ userId: birthday.userId }, {
                        $set: {
                            birthday: new Date(new Date().getFullYear() + 1, birthday.birthday.getMonth(), birthday.birthday.getDate())
                        }
                    })
                    client.users.fetch(birthday.userId).then((user: User) => {
                        if (user) {
                            user.send(`Happy Birthday!`)
                            const mutualGuilds = client.guilds.cache.filter((u) => !!u.members.cache.get(user.id))
                            mutualGuilds.forEach((guild) => {
                                client.birthdayConfigs.findOne({ guildId: guild.id }).then((config) => {
                                    if (config && config.channelId) {
                                        const channel = client.channels.cache.get(config.channelId)
                                        if (!channel || !channel.isText()) return;
                                        channel.send(`Its <@${user.id}>'s birthday!`)
                                    }
                                });
                            })
                        }
                    })
                }
            })
        }
    });

}