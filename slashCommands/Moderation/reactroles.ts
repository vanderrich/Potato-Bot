import { SlashCommandBuilder } from "@discordjs/builders"
import Discord from "discord.js"

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
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: Discord.CommandInteraction, client: any, Discord: any, footers: Array<string>) {
        let title = interaction.options.getString("title");
        let description = interaction.options.getString("description");
        let channel: any = interaction.options.getChannel("channel");
        if (!channel || (!(channel instanceof Discord.TextChannel))) return interaction.reply("Please specify a text channel!");
        let options: Array<string> = [];
        let reactionRoles: Array<any> = [];
        let reactions: Array<Discord.GuildEmoji | string> = [];
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        if (!interaction.guild.me?.roles.highest.position) return interaction.reply("I don't have permission to manage roles!");
        for (let i = 1; i <= 25; i++) {
            let option = interaction.options.getString(`option${i}`);
            let emoji = interaction.options.getString(`option${i}emoji`);
            let role = interaction.options.getRole(`option${i}role`);
            if (option && emoji && role) {
                if (role.position < interaction.guild.me.roles.highest.position) {
                    if (!emoji.match(/:[a-zA-Z0-9_]+:/g)) return interaction.reply("Invalid emoji!");
                    options.push(option);
                    reactionRoles.push(role);
                    reactions.push(emoji.trim());
                } else {
                    return interaction.reply(`The role ${role.name}'s position is higher than my highest role's position!`);
                }
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setFooter({
                text: footers[Math.floor(Math.random() * footers.length)],
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })
        for (const i in reactions) {
            embed.addField(reactions[i], String(reactionRoles[i]));
        }
        channel.send({ embeds: [embed], fetchReply: true }).then((m: Discord.Message) => {
            const rr = new client.rr({
                messageId: m.id,
                channelId: channel.id,
                guildId: interaction.guildId,
                emoji: reactions,
                roleId: reactionRoles.map(r => r.id)
            })
            rr.save()
                .then(() => {
                    console.log(rr);
                })
                .catch((err: any) => {
                    console.log(err);
                })
            for (const i in reactions) {
                m.react(reactions[i])
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
// })