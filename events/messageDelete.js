const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'messageDelete',
    execute(message) {
        //ghost ping detection
        if (message.content.includes('<@') && message.content.includes('>')) {
            let user = message.content.split('<@')[1].split('>')[0];
            if (message.guild.members.cache.get(user)) {
                user = message.guild.members.cache.get(user).user;
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Ghost ping detected!")
                    .addField("Sender", message.author)
                    .addField("Pinged user", user.tag)
                    .addField("Message", message.content)
                message.channel.send(embed);
            }
        }
    }
}