  
const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	aliases: ['commands'],
	description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const { commands } = message.client;
    if (args > 0){
      
    }
    const messageEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Commands')
      .setDescription('')
    message.channel.send(messageEmbed)
	},
};