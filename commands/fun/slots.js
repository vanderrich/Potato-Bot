module.exports = {
  name: 'slots',
  description: 'play some games',
  category: "Fun",
  execute(message, args, cmd, bot, Discord, footers) {
    const footer = footers[Math.floor(Math.random() * footers.length)]
    let messages = [];
    let win = true;
    const { MessageEmbed } = Discord
    //initializes the emojis and the embed
    const diamond = bot.emojis.cache.get("894921495665573898")
    const emerald = bot.emojis.cache.get("894921477080625223")
    const potat = bot.emojis.cache.get("957927957035356180")
    var embed = new MessageEmbed()
      .setTitle('Slots')
      .setDescription('⬛⬛⬛')
      .setFooter({ text: footer, iconURL: message.author.avatarURL({ dynamic: true }) })

    //sends the embed message and reacts to it
    message.reply({ embeds: [embed] }).then((msg) => {
      var frameCount = Math.floor(Math.random() * 5) + 5
      for (let i = 0; i < frameCount; i++) {
        let slotdisplay = []
        for (let x = 0; x < 3; x++) {
          switch (Math.floor(Math.random() * 3)) {
            case 1:
              slotdisplay[x] = diamond
              break;
            case 2:
              slotdisplay[x] = potat
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
        if ((slotdisplay[0].id === slotdisplay[1].id && slotdisplay[1].id === slotdisplay[2].id) && i === 0) win = true
        else if (i === 0) win = false
      }
      //sends the frames
      for (let i = 0; i < messages.length; i++) {
        msg.edit({
          embeds: [messages[i].setFooter({ text: footer, iconURL: message.author.avatarURL({ dynamic: true }) })]
        })
      }

      //sends the result
      if (win) {
        setTimeout(async function () {
          message.reply(`${message.author} won 50 💸!`);
          await bot.eco.addMoney(message.author.id, false, 50)
        }, messages.length * 1000)
      } else {
        setTimeout(async function () {
          message.reply(`You lost, try again next time`)
        }, messages.length * 1000)
      }
    })
  }
}