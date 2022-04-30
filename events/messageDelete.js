const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'messageDelete',
    execute(message) {
        //ghost ping detection
        if (message.mentions?.users.size > 0 || message.mentions?.roles.size > 0 || message?.mentions.everyone) {
            user = message.mentions.users
            roles = message.mentions.roles
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