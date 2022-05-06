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
const mongoose = require('mongoose');
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

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB.');
});

const giveawaySchema = new mongoose.Schema({
	messageId: String,
	channelId: String,
	guildId: String,
	startAt: Number,
	endAt: Number,
	ended: Boolean,
	winnerCount: Number,
	prize: String,
	messages: {
		giveaway: String,
		giveawayEnded: String,
		inviteToParticipate: String,
		drawing: String,
		dropMessage: String,
		winMessage: mongoose.Mixed,
		embedFooter: mongoose.Mixed,
		noWinner: String,
		winners: String,
		endedAt: String,
		hostedBy: String
	},
	thumbnail: String,
	hostedBy: String,
	winnerIds: { type: [String], default: undefined },
	reaction: mongoose.Mixed,
	botsCanWin: Boolean,
	embedColor: mongoose.Mixed,
	embedColorEnd: mongoose.Mixed,
	exemptPermissions: { type: [], default: undefined },
	exemptMembers: String,
	bonusEntries: String,
	extraData: mongoose.Mixed,
	lastChance: {
		enabled: Boolean,
		content: String,
		threshold: Number,
		embedColor: mongoose.Mixed
	},
	pauseOptions: {
		isPaused: Boolean,
		content: String,
		unPauseAfter: Number,
		embedColor: mongoose.Mixed,
		durationAfterPause: Number,
		infiniteDurationText: String
	},
	isDrop: Boolean,
	allowedMentions: {
		parse: { type: [String], default: undefined },
		users: { type: [String], default: undefined },
		roles: { type: [String], default: undefined }
	}
}, { id: false });



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
client.shop = shop;
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
const giveawayModel = mongoose.model('giveaways', giveawaySchema);
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
	// This function is called when the manager needs to get all giveaways which are stored in the database.
	async getAllGiveaways() {
		// Get all giveaways from the database. We fetch all documents by passing an empty condition.
		return await giveawayModel.find().lean().exec();
	}

	// This function is called when a giveaway needs to be saved in the database.
	async saveGiveaway(messageId, giveawayData) {
		// Add the new giveaway to the database
		await giveawayModel.create(giveawayData);
		// Don't forget to return something!
		return true;
	}

	// This function is called when a giveaway needs to be edited in the database.
	async editGiveaway(messageId, giveawayData) {
		// Find by messageId and update it
		await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
		// Don't forget to return something!
		return true;
	}

	// This function is called when a giveaway needs to be deleted from the database.
	async deleteGiveaway(messageId) {
		// Find by messageId and delete it
		await giveawayModel.deleteOne({ messageId }).exec();
		// Don't forget to return something!
		return true;
	}
};
client.giveawaysManager = new GiveawayManagerWithOwnDatabase(client, {
	default: {
		botsCanWin: false,
		embedColor: "RANDOM",
		embedColorEnd: "RANDOM",
		reaction: "🥔",
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
const rrSchema = new mongoose.Schema({
	guildId: String,
	channelId: String,
	messageId: String,
	userId: String,
	emoji: [String],
	roleId: [String],
	timestamp: String
}, { id: false });


client.rr = new mongoose.model('rr', rrSchema);

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