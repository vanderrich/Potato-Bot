const categories = ["Currency", "Fun", "Info", "Moderation", "Music", "Work in Progress", "BotAdminOnly"]
const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	aliases: ['commands'],
	description: 'List all of my commands or info about a specific category.',
	usage: '[command name]',
	cooldown: 5,
	category: "Info",
	execute(message, args, cmd, client, Discord, footers) {
		const { commands } = client;
		if (args.length > 0) {
			let category = args[0].charAt(0).toUpperCase() + args[0].slice(1)
			if (!(categories.includes(category))) {
				return message.channel.send("No category with that name")
			}
			commandsInCategory = []
			commands.forEach(command => {
				if (command.category == category) {
					commandsInCategory.push(command)
				}
			})
			const messageEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle(category)
				.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
			for (command in commandsInCategory) {
				command = commandsInCategory[command]
				description = command.description ? (command.usage ? (command.description + '\n' + command.usage) : command.description) : (command.usage ? command.usage : "No Description Available")
				messageEmbed.addField(command.name, description)
			}
			return message.channel.send({ embeds: [messageEmbed] })

		}
		let a = []
		for (let category in categories) {
			let value = 0
			commands.forEach(command => {
				if (command.category == categories[category]) {
					value++
				}
			});
			if (categories[category] == "Work in Progress" || categories[category] == "BotAdminOnly") continue
			a.push({ name: categories[category], value: `${value} commands in that category` })
		}
		const messageEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Commands')
			.setDescription(`Write ${prefix}help <category> to see the commands in the category`)
			.addFields(...a)
			.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
		message.channel.send({ embeds: [messageEmbed] })
	},
};