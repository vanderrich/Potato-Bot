"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'guildDelete',
    execute(guild, client) {
        var _a, _b, _c, _d, _e, _f;
        const channel = (_e = (_d = (_c = (_b = (_a = client === null || client === void 0 ? void 0 : client.guilds) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.get("962861680226865193")) === null || _c === void 0 ? void 0 : _c.channels) === null || _d === void 0 ? void 0 : _d.cache) === null || _e === void 0 ? void 0 : _e.get("979662019202527272");
        if ((channel === null || channel === void 0 ? void 0 : channel.type) == "GUILD_TEXT")
            channel.send(`Left guild: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
        (_f = client === null || client === void 0 ? void 0 : client.user) === null || _f === void 0 ? void 0 : _f.setActivity(`Serving ${client.guilds.cache.size} servers`);
    }
};
