module.exports = {
    name: 'reactroles',
    description: "Reaction roles",
    permissions: 'ADMINISTRATOR',
    category: "Moderation",
    async execute(message, args, cmd, client, Discord, footers) {
        const filter = (m) => {
            return m.author.id === message.author.id;
        }
        message.reply('Reaction Roles')
        message.reply('Enter the title of the reaction role')
        let i = 0;
        let reactions = [];
        let reactionRoles = [];
        let title;
        let description;
        let channel;
        const collector = new Discord.MessageCollector(message.channel, { filter, idle: 30_000 });
        collector.on('collect', m => {
            switch (i) {
                case 0:
                    title = m.content;
                    message.reply("Enter description")
                    break;
                case 1:
                    description = m.content;
                    message.reply("Enter channel to send the message")
                    break;
                case 2:
                    channel = m.mentions.channels.first();
                    message.reply("Enter the reaction (wait 30 seconds to leave)")
                    break;
                default:
                    if (i % 2 == 1) {
                        if (m.content.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu) != null) {
                            reactions.push(m.content)
                            message.reply("Enter the reaction role (wait 30 seconds to leave)")
                        } else {
                            message.reply("Not a valid reaction, try again (e.g 👍)")
                            i--
                        }
                    }
                    else {
                        if (!m.mentions.roles.first()) {
                            message.reply("Not a valid role, try again")
                            i--
                        } else {
                            reactionRoles.push(m.mentions.roles.first())
                            message.reply("Enter the reaction (wait 30 seconds to leave)")
                        }
                    }
                    break;
            }
            i++
        });
        collector.on('end', collected => {
            if (reactions.length < 1) return
            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: message.author.avatarURL({ dynamic: true }) })
            for (const i in reactions) {
                embed.addField(reactions[i], String(reactionRoles[i]));
            }
            reply({ embeds: [embed] }).then(m => {
                for (const i in reactions) {
                    m.react(reactions[i])
                    //client.rr.push({ messageId: m.id, channelId: channel.id, guildId: message.guild.id, emoji: reactions[i], roleId: reactionRoles[i].id })
                    client.rr.push(m.id, { messageId: m.id, channelId: channel.id, guildId: message.guild.id, emoji: reactions[i], roleId: reactionRoles[i].id })
                }
            })
        });

    }
}
// some old code in case i need it for examples
// const filter = (m) => {
//     return m.author.id === message.author.id;
// }
// message.reply('Reaction Roles')
// message.reply('Enter the title of the reaction role')
// let i = 0;
// let reactions = [];
// let reactionRoles = [];
// let title;
// let description;
// let channel;
// const collector = new Discord.MessageCollector(message.channel, { filter, idle: 30_000 });
// collector.on('collect', m => {
//     switch (i) {
//         case 0:
//             title = m.content;
//             message.reply("Enter description")
//             break;
//         case 1:
//             description = m.content;
//             message.reply("Enter channel to send the message")
//             break;
//         case 2:
//             channel = m.mentions.channels.first();
//             message.reply("Enter the reaction (wait 30 seconds to leave)")
//             break;
//         default:
//             if (i % 2 == 1) {
//                 if (m.content.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu) != null) {
//                     reactions.push(m.content)
//                     message.reply("Enter the reaction role (wait 30 seconds to leave)")
//                 } else {
//                     message.reply("Not a valid reaction, try again (e.g 👍)")
//                     i--
//                 }
//             }
//             else {
//                 if (!m.mentions.roles.first()) {
//                     message.reply("Not a valid role, try again")
//                     i--
//                 } else {
//                     reactionRoles.push(m.mentions.roles.first())
//                     message.reply("Enter the reaction (wait 30 seconds to leave)")
//                 }
//             }
//             break;
//     }
//     i++
// });
// collector.on('end', collected => {
//     const embed = new Discord.MessageEmbed()
//         .setTitle(title)
//         .setDescription(description)
//     for (const i in reactions) {
//         embed.addField(reactions[i], String(reactionRoles[i]));
//     }
//     reply({ embeds: [embed] }).then(m => {
//         for (const i in reactions) {
//             m.react(reactions[i])
//         }
//         const filter1 = (reaction, user) => reaction.emoji in reactions && user.id !== client.user.id;
//         const collector = m.createReactionCollector({ filter1, time: Infinity, max: Infinity });
//         collector.on('collect', (reaction, user) => {
//             message.reply(`<@${user.id}> reacted with ${reaction.emoji}`)
//             const reactionIndex = reactions.findIndex(reaction)
//             const member = guild.members.cache.get(user.id)
//             member.roles.add(reactionRoles[reactionIndex])
//         });
//     })
// });