import { Message, MessageEmbed } from "discord.js"
import { Event } from "../Util/types";

module.exports = {
    name: 'messageDelete',
    execute(message: Message) {
        //ghost ping detection
        if (message.mentions?.users.size > 0 || message.mentions?.roles.size > 0 || message?.mentions.everyone) {
            if (message.author.bot || message.channel.type === "DM" || !message.guild!.me?.permissions || !message.channel.permissionsFor(message.guild!.me).has("SEND_MESSAGES") && message.channel.permissionsFor(message.guild!.me).has("VIEW_CHANNEL")) return;
            const user = message.mentions.users
            const roles = message.mentions.roles
            const everyone = message.mentions.everyone
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Ghost ping detected!")
                .addFields(
                    { name: "Sender", value: message.author.toString() },
                    { name: "Pinged user(s)", value: `${user.map(u => u.toString()).join(", ")}, ${roles.map(r => r.toString()).join(", ")}, ${everyone ? " @everyone" : ""}` },
                    { name: "Message", value: message.content })
                .setFooter({ text: "To turn this off go to the settings use /settings" })
            message.channel.send({ embeds: [embed] });
        }
    }
} as Event;