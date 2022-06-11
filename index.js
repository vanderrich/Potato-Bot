//initialize variables
const { Player } = require('discord-player');
const fs = require('fs')
const Discord = require('discord.js');
const { shop, settings, tags, tagDescriptions } = require('./config.json');
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const Economy = require('currency-system');
const { deploy } = require('./deploy-commands.js');
const { GiveawaysManager } = require('discord-giveaways');
const mongoose = require('mongoose');
const localizations = require('./localization.json');
// const setupSubscriptions = require('./Util/setupSubscriptions.js');

const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_VOICE_STATES"],
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER", "GUILDS"],
});

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: false
});

//caches
client.cachedTags = new Discord.Collection();
client.cachedShopItems = new Discord.Collection();
client.cachedInventories = new Discord.Collection();
client.globalShopItems = [];

const updateCache = () => {
	client.guildSettings.find({}, (err, docs) => {
		if (err) return console.log(err);
		docs.forEach(guildSetting => {
			if (!guildSetting.tags) return;
			const tags = [];
			guildSetting.tags.forEach(tag => {
				tags.push({
					name: tag.name,
					value: tag.value,
				});
			});
			client.cachedTags.set(guildSetting.guildId, tags);
		});
	});
	client.guilds.cache.forEach(guild => {
		if (!guild.available) return;
		client.eco.getShopItems({ guild: guild.id })
			.then(items => {
				const shopItemsCache = []
				items.inventory.forEach((item, key) => {
					shopItemsCache.push({
						name: item.name,
						value: `${key + 1}_local`
					});
				});
				client.cachedShopItems.set(guild.id, shopItemsCache);
			});
	});

	client.users.cache.forEach(user => {
		client.eco.getUserItems({ user: user.id })
			.then(items => {
				const userItemsCache = []
				items.inventory.forEach((item, key) => {
					userItemsCache.push({
						name: item.name,
						value: key + 1
					});
				});
				client.cachedInventories.set(user.id, userItemsCache);
			});
		client.languages.findOne({ user: user.id }, (err, doc) => {
			if (err) return console.log(err);
			if (!doc) return;
			languagesCache.set(user.id, doc.language);
		});
	});
}

const languagesCache = new Discord.Collection();

client.getLocale = (user, string, ...vars) => {
	let language = languagesCache.get(user) || client.users.cache.get(user).locale || 'en';
	if (!localizations[language]) language = 'en';
	string = string.split('.');
	let locale = localizations[language];
	for (let i = 0; i < string.length; i++) {
		locale = locale[string[i]];
		if (locale === undefined) return undefined;
	}

	let count = 0;
	if (typeof locale == "string") locale = locale.replace(/\${VAR}/g, () => {
		count++
		return vars[count - 1] !== null ? vars[count - 1] : "${VAR}";
	})

	return locale;
}


mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', async () => {
	console.log('Connected to MongoDB.');
	const eco = new Economy;
	client.languages = mongoose.model('languages', mongoose.Schema({
		user: { type: String, required: true },
		language: { type: String, required: true },
	}));
	Economy.cs.on('debug', (debug, error) => {
		console.log(debug);
		if (error) console.error(error);
	});
	eco.setMongoURL(process.env.MONGO_URI);
	eco.setDefaultBankAmount(100);
	eco.setMaxBankAmount(0);
	eco.setItems({ shop });
	client.eco = eco;
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
	client.playlists = mongoose.model('playlists', new mongoose.Schema({
		name: String,
		tracks: Array,
		creator: { type: String },
		managers: { type: [String] },
		settings: {
			loop: Number,
			shuffle: Boolean,
			volume: Number,
		}
	}).index());
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
	const rrSchema = new mongoose.Schema({
		guildId: String,
		channelId: String,
		messageId: String,
		userId: String,
		emoji: [String],
		roleId: [String],
		timestamp: String
	}, { id: false });
	client.rr = mongoose.model('rr', rrSchema);
	client.tickets = mongoose.model('tickets', new mongoose.Schema({
		guildId: String,
		categoryId: String,
		closeCategoryId: String,
		channelId: Array,
		messageId: String,
		title: String,
		description: String,
	}));

	client.birthdays = mongoose.model('birthdays', new mongoose.Schema({
		userId: String,
		guildId: String,
		birthday: Date,
	}));

	client.birthdayConfigs = mongoose.model('birthdayConfigs', new mongoose.Schema({
		guildId: { type: String },
		channelId: String,
		roleId: String,
		message: String,
	}));

	client.guildSettings = mongoose.model('guildSettings', new mongoose.Schema({
		guildId: { type: String, required: true },
		badWords: { type: [String], default: settings.badWordPresets.low },
		autoPublishChannels: { type: [String], default: [] },
		welcomeMessage: { type: String, default: "" },
		welcomeChannel: { type: String, default: "" },
		welcomeRole: { type: String, default: "" },
		tags: { type: [{ name: String, value: String }], default: [] },
		suggestionChannel: { type: String, default: "" },
		tagDescriptions: { type: Object, default: {} },
		ghostPing: { type: Boolean, default: true },
	}));

	client.guildSettings.deleteMany({ guildId: { $exists: false } }, (err) => {
		if (err) console.log(err);
	});
	client.forms = mongoose.model('forms', new mongoose.Schema({
		guildId: String,
		title: String,
		description: String,
		customId: String,
		fields: Array,
		color: String,
	}));
	setInterval(updateCache, 60000);
	updateCache();
	await client.login(token);
	deploy(client);
	client.eco.getShopItems({ user: client.user.id })
		.then(items => {
			items.inventory.forEach((item, key) => {
				client.globalShopItems.push({
					name: item.name,
					value: (key + 1).toString()
				});
			});
		});
});

client.shop = shop;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.contextMenus = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.selectMenus = new Discord.Collection();
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
const player = client.player

// //initialize commands
// const commandFolders = fs.readdirSync('./commands');
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
		if (!command.data || command.isSubcommand) continue;
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

//initialize message component stuff
const buttonFiles = fs.readdirSync('./messageComponents/buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
	const button = require(`./messageComponents/buttons/${file}`);
	client.buttons.set(button.name, button);
}

const selectMenuFiles = fs.readdirSync('./messageComponents/selectMenus').filter(file => file.endsWith('.js'));
for (const file of selectMenuFiles) {
	const selectMenu = require(`./messageComponents/selectMenus/${file}`);
	client.selectMenus.set(selectMenu.name, selectMenu);
}

const logs = [],
	hook_stream = function (_stream, fn) {
		// Reference default write method
		var old_write = _stream.write;
		// _stream now write with our shiny function
		_stream.write = fn;

		return function () {
			// reset to the default write method
			_stream.write = old_write;
		};
	},

	// hook up standard output
	unhook_stdout = hook_stream(process.stdout, function (string, encoding, fd) {
		logs.push(string);
	});

client.logs = logs;
client.unhook_stdout = unhook_stdout;

//other random thingy
player.on('error', (queue, error) => {
	// temp fix until https://github.com/Androz2091/discord-player/pull/1107 is merged and released
	if (error.message === '[DestroyedQueue] Cannot use destroyed queue') return;
	queue.metadata.send(`There was a problem with the track queue => ${error.message}`);
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
// setupSubscriptions(client, mongoose);
process.on("unhandledRejection", _ => {
	console.error(_.stack + '\n' + '='.repeat(20))
	client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`<@709950767670493275> Bot Crashed!\n\`\`\`${_?.stack?.slice(0, 1000)}\`\`\``); // log the crash to the bot logs channel
});