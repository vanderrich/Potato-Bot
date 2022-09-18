// import { CommandInteraction, MessageEmbed, Message, MessageReaction, User } from "discord.js";

// //gets the words from config.json
// const { words } = require('../../config.json')
// const delay = (ms: number) => {
//     return new Promise(resolve => setTimeout(() => {
//         resolve(null);
//     }, ms));
// }
// module.exports = {
//     name: 'fasttype',
//     description: 'type fast',
//     category: "Fun",
//     async execute(interaction: typeof CommandInteraction, client: any) {
//         if (!interaction.channel || !interaction.channel.isText()) return interaction.reply("This command can only be used in a server!");
//         //sends the starting embed message
//         const embed = new MessageEmbed()
//             .setColor('RANDOM')
//             .setTitle('Fast type game is starting!')
//             .setDescription('To participate, react on ✅')
//             .addField('Goal: Be the fastest to write the words indicated.', 'you can exit the game by typing \`stop\` in the chat')
//             .setFooter({ text: 'to stop the game for everyone, type \`stopgame\`' })
//         const message = await interaction.reply({ embeds: [embed], fetchReply: true });
//         if (!(message instanceof Message)) return;
//         await message.react('✅')
//         let joinedUsers: any[] = []
//         let log = []
//         //filter
//         const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === '✅' && user.id !== message.author.id

//         //creates a reaction collector and if someone reacts, add the user to the joined Users array
//         const collector = message.createReactionCollector({ filter, time: 30000 });
//         collector.on('collect', (reaction, user) => {
//             message.reply(`${user} joined the game!`);
//             joinedUsers.push({ userId: user.id, points: 0 })
//         });

//         collector.on('end', collected => {
//             if (collected.size == 0) {
//                 message.reply('No one joined the game')
//                 return
//             }
//             message.reply(`${collected.size} players joined the game!`)
//             message.reply('Starting game...')
//             play(joinedUsers)
//         });

//         async function play(players: any[]) {
//             let count: number = 0;
//             for (let i = 0; i < 10; i++) {
//                 let word = words[Math.floor(Math.random() * words.length)]
//                 interaction.channel?.send(word)
//                 const collector = await interaction.channel?.awaitMessages({ time: 30000, errors: ['time'] })((m) => {
//                     if (m.content === 'stop') {
//                         interaction.channel?.send(`${m.user} stopped the game!`)
//                         collector.stop()
//                         return
//                     }

//                     if (m.author.id === client.user.id) return
//                     if (m.content === word) {
//                         count++
//                         players.find((player) => player.userId === m.author.id).points += count
//                         log.push({ user: m.author, points: count })
//                         m.react('🥇')
//                     }
//                 }).catch(collected => {
//                     count = 0
//                 });
//                 delay(5000)
//             }
//             message.reply('Game ended!')
//             let sortedPlayers = players.sort((a, b) => b.points - a.points)
//             let place = 1
//             for (let player of sortedPlayers) {
//                 message.reply(`${place}. ${client.users.cache.get(player.userId)}: ${player.points}`)
//                 place++
//             }

//         }
//     }
// }