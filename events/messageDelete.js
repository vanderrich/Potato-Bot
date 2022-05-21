const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'messageDelete',
    execute(message, client) {
        //ghost ping detection
        if (message.mentions?.users.size > 0 || message.mentions?.roles.size > 0 || message?.mentions.everyone) {
            if (message.author.bot) return;
            let user = message.mentions.users
            let roles = message.mentions.roles
            let everyone = message.mentions.everyone
            user = user + roles + everyone
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Ghost ping detected! 👻")
                .addField("Sender", message.author.toString())
                .addField("Pinged user(s)", user.map(u => u.toString()).join(", "))
                .addField("Message", message.content)
            message.channel.send({ embeds: [embed] });
        }
    }
}