
module.exports = {
    name: 'reactroles',
    description: "Reaction roles",
    permissions: 'ADMINISTRATOR',
    category: "Moderation",
    async execute(message, args, cmd, client, Discord) {
        if (!args[0]) {
            return message.reply("Missing required argument: Emoji");
        }
        if (!args[1]) {
            return message.reply("Missing required argument: Title of embed");
        }
        let role2 = message.mentions.roles.first();

        if (!role2) {
            role2 = message.guild.roles.cache.get(args[2]);
            console.log("not mentioned");
        }
        if (!role2) {
            return message.reply("Missing required argument: Role");
        }
        let channel = message.mentions.channels.first();

        if (!channel) {
            channel = message.guild.roles.cache.get(args[3]);
            console.log("not mentioned");
        }
        if (!channel) {
            return message.reply("Missing required argument: Channel");
        }

        console.log(channel)
        message.channel.send(channel)
        client.reactionRoleManager.create({
            messageID: args[1],
            channelID: channel.id,
            reaction: args[0],
            role: role2
        })
        message.channel.send('Don');

        return;

    }
}
// some old code in case i need it for examples
// const filter = (m) => {
//     return m.author.id === message.author.id;
// }
// message.channel.send('Reaction Roles')
// message.channel.send('Enter the title of the reaction role')
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
//             message.channel.send("Enter description")
//             break;
//         case 1:
//             description = m.content;
//             message.channel.send("Enter channel to send the message")
//             break;
//         case 2:
//             channel = m.mentions.channels.first();
//             message.channel.send("Enter the reaction (wait 30 seconds to leave)")
//             break;
//         default:
//             if (i % 2 == 1) {
//                 if (m.content.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu) != null) {
//                     reactions.push(m.content)
//                     message.channel.send("Enter the reaction role (wait 30 seconds to leave)")
//                 } else {
//                     message.channel.send("Not a valid reaction, try again (e.g 👍)")
//                     i--
//                 }
//             }
//             else {
//                 if (!m.mentions.roles.first()) {
//                     message.channel.send("Not a valid role, try again")
//                     i--
//                 } else {
//                     reactionRoles.push(m.mentions.roles.first())
//                     message.channel.send("Enter the reaction (wait 30 seconds to leave)")
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
//     channel.send({ embeds: [embed] }).then(m => {
//         for (const i in reactions) {
//             m.react(reactions[i])
//         }
//         const filter1 = (reaction, user) => reaction.emoji in reactions && user.id !== client.user.id;
//         const collector = m.createReactionCollector({ filter1, time: Infinity, max: Infinity });
//         collector.on('collect', (reaction, user) => {
//             message.channel.send(`<@${user.id}> reacted with ${reaction.emoji}`)
//             const reactionIndex = reactions.findIndex(reaction)
//             const member = guild.members.cache.get(user.id)
//             member.roles.add(reactionRoles[reactionIndex])
//         });
//     })
// });