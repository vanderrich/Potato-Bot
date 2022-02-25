module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: "Info",
	execute(message, args, cmd, client, Discord) {
		const embed = new Discord.MessageEmbed()
		const ping = Date.now() - message.createdTimestamp
		const fieldMessage = (ping < 1) ? "Lightning Fast" : (ping < 5) ? "Very Fast" : (ping < 10) ? "Quite Fast" : (ping < 15) ? "Fast" : (ping < 50) ? "Moderately Fast" : (ping < 100) ? "Faster than normal" : (ping < 500) ? "Normal" : (ping < 1000) ? "Slower than normal" : (ping < 2500) ? "Quite Slow" : (ping < 5000) ? "Very Slow" : (ping < 10000) ? "Insanely Slow" : "Is the bot dead???"
		embed.setTitle("Ping")
		embed.setDescription(`**Ping is ${ping}ms. API Latency is ${Math.round(client.ws.ping)}ms**`);
		embed.addField("In words", `${fieldMessage}`, true)
		embed.setFooter("Pong")
		message.channel.send({ embeds: [embed] });
	},
};