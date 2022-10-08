//initialize variables
import fs from 'fs';
import Discord from 'discord.js';
import Economy from 'currency-system';
import { deploy } from './deploy-commands';
import mongoose from 'mongoose';
import localizations from './localization.json';
import * as Types from './Util/types';
import { v4 as uuidv4 } from 'uuid';
import { updateStats } from './Util/serverstats';
import fetch from "node-fetch";
import { config } from "dotenv";
config();

const token = process.env.DISCORD_TOKEN;
type languages = keyof typeof localizations;
// const setupSubscriptions from './Util/setupSubscriptions.js');

const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_VOICE_STATES"],
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER"],
}) as Types.Client;

mongoose.connect(process.env.MONGO_URI!, {
	autoIndex: false
});

//caches
client.cachedTags = new Discord.Collection();
client.cachedShopItems = new Discord.Collection();
client.cachedInventories = new Discord.Collection();
client.globalShopItems = [];

const updateCache = () => {
	client.guildSettings.find({}, (err: any, docs: any) => {
		if (err) return console.error(err);
		docs.forEach((guildSetting: Types.GuildSettings) => {
			if (!guildSetting.tags) return;
			const tags: Types.AutoCompleteValue[] = [];
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
			.then((items: any) => {
				const shopItemsCache: Types.AutoCompleteValue[] = []
				items.inventory.forEach((item: { name: string }, key: number) => {
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
			.then((items: any) => {
				const userItemsCache: Types.AutoCompleteValue[] = []
				items.inventory.forEach((item: { name: string }, key: number) => {
					userItemsCache.push({
						name: item.name,
						value: key + 1
					});
				});
				client.cachedInventories.set(user.id, userItemsCache);
			});
		client.languages.findOne({ user: user.id }, (err: any, doc: any) => {
			if (err) return console.error(err);
			if (!doc) return;
			languagesCache.set(user.id, doc.language);
		});
	});
}
client.updateCache = updateCache;

const languagesCache = new Discord.Collection();

client.getLocale = (interaction, string, ...vars) => {
	let language = languagesCache.get(interaction.user.id) || 'en';
	if (!localizations[language as languages]) language = 'en';
	let stringArr = string.split('.');
	let locale = localizations[language as languages] as any;
	for (let i = 0; i < stringArr.length; i++) {
		locale = locale[stringArr[i] as keyof typeof locale];
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
	console.info('Connected to MongoDB.');
});

const eco = new Economy;
client.languages = mongoose.model('languages', new mongoose.Schema({
	user: { type: String, required: true },
	language: { type: String, required: true },
}));
Economy.cs.on('debug', (debug: any, error: any) => {
	console.log(debug);
	if (error) console.error(error);
});
eco.setMongoURL(process.env.MONGO_URI);
eco.setDefaultBankAmount(100);
eco.setMaxBankAmount(0);
// eco.setItems({ shop });
client.eco = eco;

client.tickets = (mongoose.model('tickets', new mongoose.Schema({
	guildId: String,
	categoryId: String,
	closeCategoryId: String,
	channelId: Array,
	messageId: String,
	title: String,
	description: String,
})) as unknown) as Types.Client["tickets"];

client.birthdays = (mongoose.model('birthdays', new mongoose.Schema({
	userId: String,
	guildId: String,
	birthday: Date,
	haveCelebratedYears: [Number],
})) as unknown) as Types.Client["birthdays"];

client.birthdayConfigs = (mongoose.model('birthdayConfigs', new mongoose.Schema({
	guildId: { type: String },
	channelId: String,
	roleId: String,
	message: String,
})) as unknown) as Types.Client["birthdayConfigs"];

client.guildSettings = (mongoose.model('guildSettings', new mongoose.Schema({
	guildId: { type: String, required: true },
	badWords: { type: [String], default: /*settings.badWordPresets.low*/[] },
	autoPublishChannels: { type: [String], default: [] },
	welcomeMessage: { type: String, default: "" },
	welcomeChannel: { type: String, default: "" },
	welcomeRole: { type: String, default: "" },
	tags: { type: [{ name: String, value: String }], default: [] },
	suggestionChannel: { type: String, default: "" },
	tagDescriptions: { type: Object, default: {} },
	ghostPing: { type: Boolean, default: true },
	statChannels: { type: [{ type: String, channel: String, role: String }], default: [] },
})) as unknown) as Types.Client["guildSettings"];

client.subscriptions = (mongoose.model('subscriptions', new mongoose.Schema({
	type: { type: String, required: true },
	webhookId: { type: String, required: true },
	text: { type: String, required: true },
	username: { type: String, required: true },
	userId: { type: String, required: true },
})) as unknown) as Types.Client["subscriptions"]

client.guildSettings.deleteMany({ guildId: { $exists: false } }, (err: any) => {
	if (err) console.warn(err);
});
mongoose.set('debug', true);
setInterval(updateCache, 60000);
updateCache();
client.eco.getShopItems({ user: client.user?.id })
	.then((items: any) => {
		items.inventory.forEach((item: { name: string }, key: number) => {
			client.globalShopItems.push({
				name: item.name,
				value: (key + 1).toString()
			});
		});
	});
// client.shop = shop;
client.slashCommands = new Discord.Collection();
client.buttons = new Discord.Collection();
// client.contextMenus = new Discord.Collection();
// client.cooldowns = new Discord.Collection();
client.selectMenus = new Discord.Collection();
// client.player = new Player(client, {
// 	ytdlOptions: {
// 		quality: 'highestaudio', //Please don't touch
// 		filter: 'audioonly', //Please don't touch
// 		highWaterMark: 1 << 25 //Please don't touch
// 	}
// });
client.tictactoe = {};
// const player = client.player

// initialize slash commands
const slashCommandFolders = fs.readdirSync('./slashCommands');
for (const folder of slashCommandFolders) {
	//loops through all folders of commandFolders
	const commandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		//loops through all the commandFiles and add them to the client commands collection
		const command = require(`./slashCommands/${folder}/${file}`);
		if (!command.data || command.isSubcommand) continue;
		if (client.slashCommands.has(command.data.name)) console.warn(`${command.data.name} is already taken.`);
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
		client.on(event.name, (...args) => event.execute(...args, client));
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

// //other random thingy
// player.on('error', (queue: Queue, error) => {
// 	// temp fix until https://github.com/Androz2091/discord-player/pull/1107 is merged and released
// 	if (error.message === '[DestroyedQueue] Cannot use destroyed queue') return;
// 	(queue.metadata as Discord.TextChannel).send(`There was a problem with the track queue => ${error.message}`);
// });

// player.on('connectionError', (queue: Queue, error) => {
// 	(queue.metadata as Discord.TextChannel).send(`I'm having trouble connecting => ${error.message}`);
// });

// player.on('trackStart', (queue: Queue, track) => {
// 	(queue.metadata as Discord.TextChannel).send(`Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}**`);
// });

// player.on('trackAdd', (queue: Queue, track) => {
// 	(queue.metadata as Discord.TextChannel).send(`**${track.title}** added to queue.`);
// });

// player.on('botDisconnect', (queue: Queue) => {
// 	(queue.metadata as Discord.TextChannel).send('Someone from the audio channel Im connected to kicked me out, the whole playlist has been cleared! ❌');
// });

// player.on('channelEmpty', (queue: Queue) => {
// 	(queue.metadata as Discord.TextChannel).send('I left the audio channel because there is no one on my audio channel.');
// });

// player.on('queueEnd', (queue: Queue) => {
// 	(queue.metadata as Discord.TextChannel).send('All play queue finished, I think you can listen to some more music.');
// });

process.on("unhandledRejection", (error: Error) => {
	console.error(error + "\n" + error.stack + '\n' + '='.repeat(20))
	const channel = client.guilds.cache.get("962861680226865193")?.channels.cache.get("979662019202527272");
	const id = uuidv4();
	fetch('https://potato-bot.deno.dev/api/error', {
		method: 'POST',
		body: JSON.stringify({
			name: 'Error',
			id,
			type: "Crash",
			error: error.toString(),
			stack: error.stack,
		}),
		headers: {
			Authorization: process.env.SUPER_SECRET_KEY!
		}
	});
	if (!channel || !channel.isText()) return;
	const embed = new Discord.MessageEmbed()
		.setAuthor({ name: `Error: ${id}`, url: `https://potato-bot.deno.dev/error/${id}` })
		.addFields({ name: "Error", value: error.toString() }, { name: "Stack", value: error.stack! })
	channel.send({
		content: `<@709950767670493275> you got some debugging to do`,
		embeds: [embed]
	});
});

setInterval(async () => {
	updateStats(await client.guilds.fetch("962861680226865193"), client);
}, 15000);
client.login(token);
deploy(client);