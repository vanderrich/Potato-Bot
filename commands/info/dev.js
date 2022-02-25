const {devQuiz} = require('../../config.json')
module.exports = {
	name: 'dev',
	description: 'be a dev by completing a form!',
  category: "Info",
  async execute(message, args, cmd, client, Discord) {
    var embed = new Discord.MessageEmbed()
      .setTitle("Be a dev!")
    const user = client.users.cache.get(message.author.id);
    const filter = response => {
      return response.author.id == message.author.id
    }
    if (message.channel.type != "dm"){
      message.channel.send("Sent a dm of your form")
    }
    var answers = []
    for (let i = 0; i < devQuiz.length; i++) {
      embed.setDescription(devQuiz[i].question)
      await user.send(embed).then(async () => {
        await user.dmChannel.awaitMessages(filter, { max: 1, time: 50000, errors: ['time'] })
        .then(collected => {
          answers[i] = collected.first().content
        })
        .catch(collected => {
          if(collected.size == 0){
            user.send('it seems like you didn\'t respond')
          }
        });
    })
    }
    message.channel.send("done")
    for (let i = 0; i < answers.length; i++){
      answers[i] = devQuiz[i].question + ": " + answers[i]
    }
    var answersEmbed = new Discord.MessageEmbed()
      .setTitle("New dev!")
      .addFields(
        { name: 'User', value: `<@${user.id}> (${user.tag})` },
        { name: 'Form answers', value: answers, inline: true },
      )
    client.guilds.cache.get('853327201885487134').channels.cache.get('856426641596219402').send(answersEmbed)
  }
}