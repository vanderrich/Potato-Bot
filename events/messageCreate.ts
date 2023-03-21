import { Message } from "discord.js"
import { Client, Event } from "../Util/types";

module.exports = {
    name: 'messageCreate',
    async execute(message: Message, client: Client) {
        console.log(message)
        const guildSettings = await client.guildSettings.findOne({ guildId: message.guildId })
        console.log(guildSettings)
        if (!guildSettings) return
        if (guildSettings.autoemoteChannels) {
            const data = guildSettings.autoemoteChannels.find(c => c.channel == message.channelId)
            console.log(data)
            if (!data) return
            const { emoji } = data
            await message.react(emoji)
        }
        else if (guildSettings.onlyimageChannels.includes(message.channelId)) {
            let hasImage = false
            await message.attachments.forEach(attachment => {
                console.log(attachment.contentType?.includes("image"))
                if (attachment.contentType?.includes("image")) hasImage = true
            })
            console.log(hasImage)
            if (!hasImage) await message.delete()
        }
    }
} as Event;