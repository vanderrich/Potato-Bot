module.exports = {
  name: 'slots',
  description: 'play some games',
  category: "Fun",
  execute(message, args, cmd, bot, Discord) {
    var messages = [];
    const { MessageEmbed } = Discord
    //initializes the emojis and the embed
    const diamond = bot.emojis.cache.get("894921495665573898")
    const emerald = bot.emojis.cache.get("894921477080625223")
    var embed = new MessageEmbed()
      .setTitle('Slots')
      .setDescription('⬛⬛⬛')

    //sends the embed message and reacts to it
    message.channel.send({ embeds: [embed] }).then((msg) => {
      var frameCount = Math.floor(Math.random() * 5) + 5
      for (let i = 0; i < frameCount; i++) {
        var slotdisplay = []
        for (let x = 0; x < 3; x++) {
          switch (Math.floor(Math.random() * 3)) {
            case 1:
              slotdisplay[x] = diamond
              break;
            case 2:
              slotdisplay[x] = '\:seven:'
              break;
            default:
              slotdisplay[x] = emerald
              break;
          }
        }
        messages.unshift(new MessageEmbed()
          .setTitle('Slots')
          .setDescription(slotdisplay.join('')))

        //check if the player won
        if (slotdisplay.every((val, i, arr) => val === arr[0]) && i + 1 == frameCount) {
          win = true
        } else if (i + 1 == frameCount) {
          win = false
        }
      }
      //sends the frames
      for (let i = 0; i < messages.length; i++) {
        msg.edit({ embeds: [messages[i]] })
      }

      //sends the result
      if (win) {
        setTimeout(async function () {
          message.channel.send(`${message.author} won 50 💸!`);
          console.log(await bot.eco.addMoney(message.author.id, message.guild.id, 50))
        }, messages.length * 1000)
      } else {
        setTimeout(async function () {
          message.channel.send(`You lost 50 💸`)
          console.log(await bot.eco.subtractMoney(message.author.id, message.guild.id, 50))
        }, messages.length * 1000)
      }
    })
  }
}