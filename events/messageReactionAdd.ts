import { MessageEmbed, MessageReaction, User } from "discord.js"

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction: MessageReaction, user: User) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()

        if (user.bot) return

        if (reaction.emoji.name == '📌') {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${reaction.message.author?.username} said:`)
                .setDescription(`${reaction.message.content}\n\n[Jump to message](${reaction.message.url})`)
                .setFooter({ text: `Pinned from ${reaction.message.guild?.name}`, iconURL: reaction.message.guild?.iconURL()! })
                .setTimestamp();
            user.send({ embeds: [embed, ...reaction.message.embeds] })
        }
    }
}