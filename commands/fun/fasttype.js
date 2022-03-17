//gets the words from config.json
const { words } = require('../../config.json')
let user1 = []
module.exports = {
  name: 'fasttype',
  description: 'type fast',
  category: "Fun",
  async execute(msg, args, cmd, client, Discord) {
    //sends the starting embed message 
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Fast type game is starting!')
      .setDescription('To participate, react on ✅')
      .addField('Goal: Be the fastest to write the words indicated.', 'you can exit the game by typing \`stop\` in the chat')
      .setFooter('to stop the game for everyone, type \`stopgame\`')
    var message = await msg.channel.send({ embeds: [embed] })
    message.react('✅')
    var joinedUsers = []

    //filter
    const filter = (reaction, user) => reaction.emoji.name === '✅' || user.id == message.author.id

    //creates a reaction collector and if someone reacts, add the user to the joined Users array
    const collector = message.createReactionCollector({ filter, time: 15000 });
    collector.on('collect', (reaction, user) => {
      message.channel.send(`${user.tag} joined the game!`);
      joinedUsers[joinedUsers.length] = { userId: user.id, points: 0 }
      console.log(joinedUsers)
    });

    collector.on('end', collected => {
      if (collected.size == 0) {
        message.channel.send('No one joined the game')
        return
      }
      message.channel.send(`${collected.size} players joined the game!`)
      message.channel.send('Starting game...')
      play(joinedUsers)
    });

    async function play(players) {
      var randomQuestion;
      for (let step = 0; step < 10; step++) {
        randomQuestion = words[Math.floor((Math.random()) * words.length)]
        const filter1 = (response) => {
          //returns true if response content is equal to randomQuestion and response author is in the players array
          return response.content.toLowerCase() == randomQuestion && players.some(function (el) { return el.userId == response.author.id })
        };
        var collectedUsers = 0
        var collector1;
        //sends the message and wait for messages
        await message.channel.send(randomQuestion).then(async () => {
          collector1 = await message.channel.createMessageCollector(filter1, { max: 3, time: 7500, errors: ['time'] })
        })
        const collector = collector1
        //if the user was first, find the user in the player file, add the points, add it to the user array and react it
        collector.on('collect', (m) => {
          if (collectedUsers == 0) {
            players.forEach(user => {
              if (user.userId == m.author.id) {
                user.points += 3;
                user1[0] = user;
                m.react('🥇')
              }
            });
          } else if (collectedUsers == 1) {
            players.forEach(user => {
              if (user.userId == m.author.id) {
                user.points += 2
                user1[1] = user
                m.react('🥈')
              }
            })
          } else if (collectedUsers == 2) {
            players.forEach(user => {
              if (user.userId == m.author.id) {
                user.points += 1
                user1[2] = user
                m.react('🥉')
              }
            })
          }
          collectedUsers += 1
        })

        //on collecter end, send the results
        collector.on('end', collected => {
          if (collected.size === 1) {
            message.channel.send(`<@${user1[0].userId}>: ${user1[0].points}`)
          } else if (collected.size === 2) {
            message.channel.send(`<@${user1[0].userId}>: ${user1[0].points}` + '\n' + `<@${user1[1].userId}>: ${user1[1].points}`)
          } else if (collected.size === 3) {
            message.channel.send(`<@${user1[0].userId}>: ${user1[0].points}` + '\n'`<@${user1[1].userId}>: ${user1[1].points}` + '\n' + `<@${user1[2].userId}>: ${user1[2].points}`)
          } else {
            message.channel.send('Looks like nobody typed the answer this time.');
          }
          aaaaaaaaaaaaaaaa = false
        })
        await message.channel.awaitMessages(filter1, { max: 3, time: 5000, errors: ['time'] }).then(() => { console.log('') }).catch(() => { console.log('') })
      }
      var first = { userId: '', points: 0 };
      var second = { userId: '', points: 0 };
      var third = { userId: '', points: 0 };
      players.forEach(user => {
        if (user.points > first.points) {
          first = user;
        } else if (user.points > second.points) {
          second = user;
        } else if (user.points > third.points) {
          third = user;
        }
        client.eco.addMoney(userId, false, user.points)
      })
      if (!first.userId == '') {
        message.channel.send(`<@${first.userId}>🥇: ${first.points}`)
        if (!second.userId == '') {
          message.channel.send(`<@${second.userId}>🥈: ${second.points}`)
          if (!third.userId == '') {
            message.channel.send(`<@${third.userId}>🥉: ${third.points}`)
          }
        }
      }

    }
  }
}