const Discord = require("discord.js")
module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user, client) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()

        if (user.bot) return

        let reactionRole = client.rr.get(`${reaction.message.id}`)
        if (!reactionRole) return
        reactionRole.forEach(rr => {
            if (rr.emoji === reaction.emoji.toString()) {
                reactionRole = rr;
            }
        });

        try {
            reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole.roleId)
        }
        catch (err) {
            switch (err.code) {
                case 50013:
                    reaction.message.channel.send(`${user} I don't have permission to add this role!`)
                    break;
                default:
                    console.log(err)
                    break;
            }
        }
        //reaction.message.reply(`${user} reacted with ${reaction.emoji} and removed the role <@&${reactionRole.roleId}>`)
    }
}