import Discord, { Interaction } from "discord.js"

module.exports = {
    name: 'messageDelete',
    execute(message: Discord.Message, client: any) {
        //ghost ping detection
        if (message.mentions?.users.size > 0 || message.mentions?.roles.size > 0 || message?.mentions.everyone) {
            if (message.author.bot || message.channel.type === "DM" || !message.guild!.me?.permissions || message.channel.permissionsFor(message.guild!.me).has("SEND_MESSAGES")) return;
            let user = message.mentions.users
            let roles = message.mentions.roles
            let everyone = message.mentions.everyone
            let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Ghost ping detected!")
                .addField("Sender", message.author.toString())
                .addField("Pinged user(s)", `${user.map(u => u.toString()).join(", ")}, ${roles.map(r => r.toString()).join(", ")}, ${everyone ? " @everyone" : ""}`)
                .addField("Message", message.content)
                .setFooter({ text: "To turn this off go to the settings use /settings" })
            message.channel.send({ embeds: [embed] });
        }
    }
}