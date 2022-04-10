const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactroles")
        .setDescription("Make the bot send a reaction role")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("The title of the reaction role")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel to send the reaction role in")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("The description of the reaction role")
                .setRequired(true)
        )
        .addStringOption(option => option.setName("option1").setDescription("The first option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option1emoji").setDescription("The emoji of the first option of the reaction role").setRequired(true))
        .addRoleOption(option => option.setName("option1role").setDescription("The role of the first option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option2").setDescription("The second option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option2emoji").setDescription("The emoji of the second option of the reaction role").setRequired(true))
        .addRoleOption(option => option.setName("option2role").setDescription("The role of the second option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option3").setDescription("The third option of the reaction role"))
        .addStringOption(option => option.setName("option3emoji").setDescription("The emoji of the third option of the reaction role"))
        .addRoleOption(option => option.setName("option3role").setDescription("The role of the third option of the reaction role"))
        .addStringOption(option => option.setName("option4").setDescription("The fourth option of the reaction role"))
        .addStringOption(option => option.setName("option4emoji").setDescription("The emoji of the fourth option of the reaction role"))
        .addRoleOption(option => option.setName("option4role").setDescription("The role of the fourth option of the reaction role")),
    permissions: "ADMINISTRATOR",
    async execute(interaction, client, Discord, footers) {
        let title = interaction.options.getString("title");
        let description = interaction.options.getString("description");
        let channel = interaction.options.getChannel("channel");
        let options = [];
        let reactionRoles = [];
        let reactions = [];
        for (i = 1; i <= 25; i++) {
            if (interaction.options.getString("option" + i) != null) {
                options.push(interaction.options.getString("option" + i));
            }
            if (interaction.options.getString("option" + i + "emoji") != null) {
                reactions.push(interaction.options.getString("option" + i + "emoji"));
            }
            if (interaction.options.getRole("option" + i + "role") != null) {
                reactionRoles.push(interaction.options.getRole("option" + i + "role"));
            }
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setFooter({
                text: footers[Math.floor(Math.random() * footers.length)]
            })
        for (const i in reactions) {
            embed.addField(reactions[i], String(reactionRoles[i]));
        }
        channel.send({ embeds: [embed], fetchReply: true }).then(m => {
            for (const i in reactions) {
                m.react(reactions[i])
                //client.rr.push({ messageId: m.id, channelId: channel.id, guildId: message.guild.id, emoji: reactions[i], roleId: reactionRoles[i].id })
                client.rr.push(m.id, { messageId: m.id, channelId: channel.id, guildId: interaction.guild.id, emoji: reactions[i], roleId: reactionRoles[i].id })
            }
        })
        interaction.reply({ content: 'Reaction Role created!', ephemeral: true });
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