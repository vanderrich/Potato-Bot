//gets the words from config.json
const { words } = require('../../config.json')
const delay = ms => {
  return new Promise(resolve => setTimeout(() => {
    resolve();
  }, ms));
}
module.exports = {
  name: 'fasttype',
  description: 'type fast',
  category: "Fun",
  async execute(msg, args, cmd, client, Discord, footers) {
    //sends the starting embed message 
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Fast type game is starting!')
      .setDescription('To participate, react on ✅')
      .addField('Goal: Be the fastest to write the words indicated.', 'you can exit the game by typing \`stop\` in the chat')
      .setFooter({ text: 'to stop the game for everyone, type \`stopgame\`' })
    var message = await msg.channel.send({ embeds: [embed] })
    message.react('✅')
    let joinedUsers = []
    let log = []
    //filter
    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id !== message.author.id

    //creates a reaction collector and if someone reacts, add the user to the joined Users array
    const collector = message.createReactionCollector({ filter, time: 30000 });
    collector.on('collect', (reaction, user) => {
      message.channel.send(`${user} joined the game!`);
      joinedUsers.push({ userId: user.id, points: 0 })
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
      let count;
      for (let i = 0; i < 10; i++) {
        let word = words[Math.floor(Math.random() * words.length)]
        message.channel.send(word)
        const collector = await message.channel.awaitMessages({ time: 30000, errors: ['time'] }).then((m) => {
          if (m.content === 'stop') {
            message.channel.send(`${m.author} stopped the game!`)
            collector.stop()
            return
          }

          if (m.author.id === client.user.id) return
          if (m.content === word) {
            count++
            players.find((player) => player.userId === m.author.id).points += count
            log.push({ user: m.author, points: count })
            m.react('🥇')
          }
        }).catch(collected => {
          count = 0
        });
        delay(5000)
      }
      message.channel.send('Game ended!')
      let sortedPlayers = players.sort((a, b) => b.points - a.points)
      let place = 1
      for (let player of sortedPlayers) {
        message.channel.send(`${place}. ${client.users.cache.get(player.userId)}: ${player.points}`)
        place++
      }

    }
  }
}