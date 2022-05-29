import Discord from "discord.js"
module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction: Discord.MessageReaction, user: Discord.User, client: any) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()

        if (user.bot) return

        let reactionRole = await client.rr.findOne({ messageId: reaction.message.id })
        let reactionEmojiIndex = reactionRole?.emoji?.indexOf(reaction.emoji.name)
        if (!reactionEmojiIndex || reactionEmojiIndex == -1) return

        try {
            reaction.message.guild?.members.cache.get(user.id)?.roles.remove(reactionRole.roleId[reactionEmojiIndex])
            client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`${user.username} un reacted with ${reaction.emoji.name} and removed their role <@&${reactionRole.roleId[reactionEmojiIndex]}>`)
        }
        catch (err: any) {
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