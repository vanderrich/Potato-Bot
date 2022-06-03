"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
module.exports = {
    name: 'guildCreate',
    execute(guild, client) {
        var _a, _b, _c, _d, _e, _f, _g;
        const channel = (_e = (_d = (_c = (_b = (_a = client === null || client === void 0 ? void 0 : client.guilds) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.get("962861680226865193")) === null || _c === void 0 ? void 0 : _c.channels) === null || _d === void 0 ? void 0 : _d.cache) === null || _e === void 0 ? void 0 : _e.get("979662019202527272");
        if ((channel === null || channel === void 0 ? void 0 : channel.type) == "GUILD_TEXT")
            channel.send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
        (_f = client === null || client === void 0 ? void 0 : client.user) === null || _f === void 0 ? void 0 : _f.setActivity(`Serving ${client.guilds.cache.size} servers`);
        const welcomeChannel = guild.channels.cache.find(channel => channel.name.includes('welcome')) || guild.channels.cache.find(channel => channel.name.includes('general'));
        if (welcomeChannel === null || welcomeChannel === void 0 ? void 0 : welcomeChannel.isText()) {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Hi!")
                .setDescription("I'm a general purpose bot created by <@!709950767670493275>. Do /help for a list of commands.")
                .setColor("RANDOM")
                .setFooter({ text: config_json_1.footers[Math.floor(Math.random() * config_json_1.footers.length)] });
            welcomeChannel.send({ embeds: [embed] });
            if (!((_g = guild.me) === null || _g === void 0 ? void 0 : _g.permissions.has("ADMINISTRATOR"))) {
                welcomeChannel.send('Warning: I dont have administrator permissions in this guild. Please give me administrator permissions to use this bot the intended way.');
            }
        }
    }
};
