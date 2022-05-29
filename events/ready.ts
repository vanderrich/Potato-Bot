import { User } from "discord.js"

module.exports = {
    name: 'ready',
    execute(client: any) {
        console.log('Ready!')
        client.user.setUsername('Potato bot')
        client.user.setActivity(`${client.guilds.cache.size} servers`, { type: 'WATCHING' })
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
                                        client.channels.cache.get(config.channelId).send(eval('`' + config.message + '`') || `@everyone its <@${user.id}>'s birthday!`)
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    }
}