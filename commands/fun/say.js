module.exports = {
  name: 'say',  
  aliases: ['speak'],
  description: 'make the bot repeat what you said',
  category: "Fun",
  execute(message, args) {
    let argument = args.join(' ');
    if (argument.length > 1000 && !message.member.hasPermission('ADMINSTRATOR')) {
      message.reply('eyo your message too long dont even try to do that again!')
      return
    }
    message.reply(argument)
  }
} 