//initialize variables
const { Player } = require('discord-player');
const db = require("quick.db");
const fs = require('fs')
const Discord = require('discord.js');
const { shop, settings } = require('./config.json');
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const Economy = require('currency-system');
const deploy = require('./deploy-commands.js');
const { GiveawaysManager } = require('discord-giveaways');
// const Dashboard = require('discord-easy-dashboard');

const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "GUILD_PRESENCES", "GUILD_SCHEDULED_EVENTS", "GUILD_VOICE_STATES", "GUILD_WEBHOOKS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "GUILD_SCHEDULED_EVENT", "REACTION", "USER", "GUILDS"],
});
// mongoose.connect(process.env.MONGO_URI, {
// 	useNewURLParser: true,
// 	useUnifiedTopology: true,
// })

// client.eco = require('./Util/economy.js');

const eco = new Economy;
Economy.cs.on('debug', (debug, error) => {
	console.log(debug);
	if (error) console.error(error);
});
eco.setMongoURL(process.env.MONGO_URI);
eco.setDefaultBankAmount(100);
eco.setMaxBankAmount(0);
eco.setItems({ shop });
client.eco = eco;
client.db = new db.table('inv'); // quick.db
client.shop = shop;
client.job = new db.table('job')
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio', //Please don't touch
		filter: 'audioonly', //Please don't touch
		highWaterMark: 1 << 25 //Please don't touch
	},
	leaveOnEmpty: true,
	leaveOnEnd: true,
	leaveOnStop: true,
	autoSelfDeaf: true,
	leaveOnEmptyCooldown: 5000,
	initialVolume: 75,
});
client.form = new Map();
client.settings = settings;
client.tictactoe = {};
client.giveawaysManager = new GiveawaysManager(client, {
	storage: './giveaways.json',
	default: {
		botsCanWin: false,
		embedColor: '#FF0000',
		embedColorEnd: '#000000',
		reaction: '🎉'
	}
});

// client.dashboard = new Dashboard(client, {
// 	name: 'Potato Bot', // Bot's name
// 	description: 'A general purpose bot', // Bot's description
// 	baseUrl: 'http://localhost', // Leave this if ur in local development
// 	path: '/dashboard', // Dashboard's path
// 	port: 80,
// 	noPortIncallbackUrl: false, // set it to true if you want to use the callback url without port (like if you are using repl.it)
// 	secret: '_CTkCCQCwhexkmzjZCBY5yIYphM_LH7o', // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section)
// });
// client.prefixes = {}; // Prefixes for each guild
// const validatePrefix = prefix => prefix.length <= 5; // Only accepts prefixes of up to 5 characters
// const setPrefix = (discordClient, guild, value) => discordClient.prefixes[guild.id] = value; // Stores the prefix in the client.prefixes object
// const getPrefix = (discordClient, guild) => discordClient.prefixes[guild.id] || '!'; // Get the prefix in the client.prefixes object or give the default one

// // Here we indicate to the module that we want the user to be able to set the prefix of his bot
// client.dashboard.addTextInput('Prefix', 'The prefix that is added to discord messages in order to invoke commands.', validatePrefix, setPrefix, getPrefix);

const player = client.player
const commandFolders = fs.readdirSync('./commands');
client.rr = new db.table('reactionroles');

// //initialize commands
// for (const folder of commandFolders) {
// 	//loops through all folders of commandFolders
// 	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		//loops through all the commandFiles and add them to the client commands collection
// 		const command = require(`./commands/${folder}/${file}`);
// 		client.commands.set(command.name, command);
// 	}
// }

// initialize slash commands
const slashCommandFolders = fs.readdirSync('./slashCommands');
for (const folder of slashCommandFolders) {
	//loops through all folders of commandFolders
	const commandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		//loops through all the commandFiles and add them to the client commands collection
		const command = require(`./slashCommands/${folder}/${file}`);
		if (!command.data) continue;
		if (client.slashCommands.has(command.data.name)) console.log(`${command.data.name} is already taken.`);
		client.slashCommands.set(command.data.name, command);
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
//other random thingy
player.on('error', (queue, error) => {
	// temp fix until https://github.com/Androz2091/discord-player/pull/1107 is merged and released
	if (error.message === '[DestroyedQueue] Cannot use destroyed queue') return;
	queue.metadata.send(`There was a problem with the song queue => ${error.message}`);
});

player.on('connectionError', (queue, error) => {
	queue.metadata.send(`I'm having trouble connecting => ${error.message}`);
});

player.on('trackStart', (queue, track) => {
	queue.metadata.send(`🎵 Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧`);
});

player.on('trackAdd', (queue, track) => {
	queue.metadata.send(`**${track.title}** added to queue. ✅`);
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

//Run
process.on("unhandledRejection", _ => console.error(_.stack + '\n' + '='.repeat(20)));
deploy()
client.login(token);