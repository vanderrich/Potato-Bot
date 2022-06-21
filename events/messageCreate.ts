import { prefix } from '../config.json'
import Discord from 'discord.js'
import { Client } from '../Util/types'

module.exports = {
    name: 'messageCreate',
    async execute(message: Discord.Message, client: Client) {
        let guildSettings = await client.guildSettings.findOne({ guildId: message.guildId })
        for (let i = 0; i < guildSettings?.badWords.length!; i++) {
            if (message.channel.type === 'DM') break
            let badword
            try {
                badword = message.content.toLowerCase().includes(guildSettings?.badWords[i]!)
            } catch { }
            if (badword) {
                const m = await message.reply('Message contains a word in bad words list')
                message.delete()
                setTimeout(function () { m.delete() }, 5000)
                return
            }
        }

        //check if message is in the autoPublishChannels array
        if (guildSettings?.autoPublishChannels.length! > 0) {
            console.log(guildSettings?.autoPublishChannels)
            if (guildSettings?.autoPublishChannels.find((channel: string) => channel === message.channel.id))
                return message.crosspost()
        }


        // client.commands = clientCommands

        if (message.content.substring(0, prefix.length).toLowerCase() == prefix) {
            message.reply("Text commands cant be used anymore, please use slash (/) commands instead")
        }
    }
}