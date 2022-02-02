  //initialize variables
const Eco = require("quick.eco");
const db = require('quick.db')
const fs = require('fs')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord = require('discord.js');
const { prefix, shop, gameSettings, token } = require('./config.json');

const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});  
client.eco = new Eco.EconomyManager({
  adapter: "sqlite"
}); // quick.eco
client.db = new db.table('inv'); // quick.db
client.config = require("./botConfig");
client.shop = shop;
client.job = new db.table('job')
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const clientId = '894060283373449317';
const rest = new REST({ version: '9' }).setToken(token);
const commands = []


//initialize commands
for (const folder of commandFolders) {
  //loops through all folders of commandFolders
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {4
    	//loops through all the commandFiles and add them to the client commands collection
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
		commands.push(command.data.toJSON());
	}
}

//initialize events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  //loops through all files in eventFiles and process them
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args,client, client.commands));
	}
}

//slash commands
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

//login
client.login(token);