//initialize variables
const Service = require('node-windows').Service;
const { Player } = require('discord-player');
const Eco = require("quick.eco");
const db = require('quick.db')
const fs = require('fs')
const Discord = require('discord.js');
const { prefix, shop, gameSettings, token } = require('./config.json');

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_MEMBERS
	]
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
client.player = new Player(client, client.config.opt.discordPlayer);
const player = client.player
const commandFolders = fs.readdirSync('./commands');

// Run the bot as a service
var svc = new Service({
	name: 'Potato bot',
	description: 'potatoes',
	script: 'D:\\programing\\programming\\GitHub\\Potato-Bot\\index.js'
});


//initialize commands
for (const folder of commandFolders) {
  //loops through all folders of commandFolders
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {4
    	//loops through all the commandFiles and add them to the client commands collection
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
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
		client.on(event.name, (...args) => event.execute(...args, client, client.commands));
	}
}

//other random thingys
player.on('error', (queue, error) => {
	console.log(`There was a problem with the song queue => ${error.message}`);
});

player.on('connectionError', (queue, error) => {
	console.log(`I'm having trouble connecting => ${error.message}`);
});

player.on('trackStart', (queue, track) => {
	if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
	queue.metadata.send(`🎵 Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧`);
});

player.on('trackAdd', (queue, track) => {
	queue.metadata.send(`**${track.title}** added to playlist. ✅`);
});

player.on('botDisconnect', (queue) => {
	queue.metadata.send('Someone from the audio channel Im connected to kicked me out, the whole playlist has been cleared! ❌');
});

player.on('channelEmpty', (queue) => {
	queue.metadata.send('I left the audio channel because there is no one on my audio channel. ❌');
});

player.on('queueEnd', (queue) => {
	queue.metadata.send('All play queue finished, I think you can listen to some more music. ✅');
});

svc.on('install', function () {
	svc.start();
});

svc.on('start', function () {
	console.log(svc.name + ' started!\nVisit http://127.0.0.1:3000 to see it in action.');
});


//Run
client.login(token);
svc.install();