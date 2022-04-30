module.exports = {
    name: 'guildDelete',
    execute(guild, client) {
        console.log(`Left guild: ${guild.name} (id: ${guild.id}). This guild had ${guild.memberCount} members!`);
        client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
    }
};