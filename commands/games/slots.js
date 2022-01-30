const {MessageEmbed} = require('discord.js')
module.exports = {
	name: 'slots',
	description: 'play some games',
	execute(message, args) {
    var messages = [];
    var bot = message.client
    //initializes the emojis and the embed
    const diamond = bot.emojis.cache.get("894921495665573898")
    const emerald = bot.emojis.cache.get("894921477080625223")
    const potat = bot.emojis.cache.get("894921699173208074")
    const goldenRing = bot.emojis.cache.get("854883219399639040")
    var embed = new MessageEmbed()
      .setTitle('Slots')
      .setDescription('⬛⬛⬛')
    
    //sends the embed message and reacts to it
    message.channel.send(embed).then((msg)=>{
      var frameCount = Math.floor(Math.random()*5)+5
      for (let i = 0; i < frameCount; i++){
        var slotdisplay = []
        for (let x = 0; x < 3; x++){
          switch(Math.floor(Math.random()*5)) {
            case 1:
              slotdisplay[x] = diamond
              break;
            case 2:
              slotdisplay[x] = '\:seven:'
              break;
            case 3:
              slotdisplay[x] = emerald
              break
            case 4:
              slotdisplay[x] = potat
              break
            default:
              slotdisplay[x] = goldenRing
              break
          }
        }
        messages.unshift(new MessageEmbed()
          .setTitle('Slots')
          .setDescription(slotdisplay.join('')))

        //check if the player won
        if (slotdisplay.every( (val, i, arr) => val === arr[0] ) &&  i+1 == frameCount){
          win = true
        }else if (i+1 == frameCount){
          win = false
        }
      }
      //sends the frames
      for(let i = 0; i < messages.length; i++){
        msg.edit(messages[i])
      }

      //sends the result
      if (win){
        setTimeout(function(){message.channel.send(`${message.author} won!`)}, messages.length * 1000)
      }else{
        setTimeout(function(){message.channel.send(`You lost`)}, messages.length * 1000)
      }
    })
  }
}